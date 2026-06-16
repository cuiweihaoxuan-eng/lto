/**
 * Dify API 服务
 * 处理与 Dify/星辰平台 后端的流式对话交互
 * 支持多种 AI 平台：Dify、星辰平台、星智平台
 */

import DIFY_CONFIG from '../config/dify';

// 平台类型枚举
export type PlatformType = 'dify' | '星辰平台' | '星智平台';

export interface DifyMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  conversationId?: string;
  files?: FileItem[];
}

export interface FileItem {
  id: string;
  name: string;
  type: 'image' | 'file';
  preview?: string;
}

export interface ToolCall {
  id: string;
  toolName: string;
  thought: string;
  observation?: string;
  request?: Record<string, unknown>;
  response?: Record<string, unknown>;
  isRealToolCall?: boolean;
  // 工具调用发生时的 m.content 长度，作为渲染时插入位置的锚点
  // （AI 实际输出可能是 think → tool → text → think → tool 交叉，
  //  工具调用段必须按 m.content 累积到该长度时插入，而不是堆底）
  contentLength?: number;
}

export interface SendMessageOptions {
  query: string;
  conversationId?: string;
  inputs?: Record<string, string>;
  files?: FileItem[];
  apiKey?: string;
  baseUrl?: string;
  platform?: PlatformType;  // 新增：平台类型
  onMessage: (content: string, event?: string) => void;
  onThought?: (thought: string, observation?: string, tool?: string) => void;
  onToolCall?: (toolCall: ToolCall) => void;
  onComplete: (conversationId: string) => void;
  onError: (error: Error) => void;
}

// think 标签正则：支持全角和半角括号
// 星辰格式：<think>...</think>
// think 标签正则：支持多种格式
const THINK_START_PATTERN = /<think>|<think>|<think>/i;
const THINK_END_PATTERN = /<\/think>|<\/think>|<\/think>/i;
export async function uploadFileToXingchen(file: File, apiKey: string, baseUrl: string, user: string): Promise<string | null> {

  console.log('[星辰平台] 开始上传文件到:', `${baseUrl}/files/upload`);

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', user);

    const response = await fetch(`${baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    console.log('[星辰平台] 上传响应状态:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('[星辰平台] 文件上传成功，响应数据:', data);
      // 星辰平台返回 id
      return data.id || null;
    } else {
      const errorText = await response.text();
      console.error('[星辰平台] 文件上传失败:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('[星辰平台] 文件上传异常:', error);
    return null;
  }
}

/**
 * 上传文件到 Dify，获取 file_id
 * @param file - File 对象
 * @param apiKey - API 密钥
 * @param baseUrl - API 地址
 */
export async function uploadFileToDify(file: File, apiKey: string, baseUrl: string): Promise<string | null> {
  console.log('[Dify] 开始上传文件到:', `${baseUrl}/files/upload`);
  console.log('[Dify] 文件信息:', { name: file.name, size: file.size, type: file.type });

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user', DIFY_CONFIG.user);

    const response = await fetch(`${baseUrl}/files/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: formData,
    });

    console.log('[Dify] 上传响应状态:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('[Dify] 文件上传成功，响应数据:', data);
      // Dify 返回格式可能是 { id, type, name, size, url } 或 { file_id, ... }
      return data.id || data.file_id || data.file?.id || null;
    } else {
      const errorText = await response.text();
      console.error('[Dify] 文件上传失败:', response.status, errorText);
      return null;
    }
  } catch (error) {
    console.error('[Dify] 文件上传异常:', error);
    return null;
  }
}

/**
 * 发送消息到 AI 后端并处理流式响应
 * 支持 Dify 和星辰平台
 */
export async function sendDifyMessage(options: SendMessageOptions): Promise<AbortController> {
  const { query, conversationId, inputs = {}, files, apiKey, baseUrl, platform = 'dify', onMessage, onThought, onToolCall, onComplete, onError } = options;

  const controller = new AbortController();
  const effectiveBaseUrl = baseUrl || DIFY_CONFIG.baseUrl;
  const effectiveApiKey = apiKey || DIFY_CONFIG.apiKey;
  const effectiveUser = DIFY_CONFIG.user;
  const effectivePlatform = platform || 'dify';

  try {
    // 处理文件上传
    let fileIds: string[] = [];
    console.log(`[${effectivePlatform}] sendDifyMessage 被调用，files 参数:`, files);

    if (files && files.length > 0) {
      console.log(`[${effectivePlatform}] 开始上传文件:`, files.map(f => ({ name: f.name, type: f.type, preview: f.preview })));
      for (const fileItem of files) {
        console.log(`[${effectivePlatform}] 处理文件:`, fileItem.name, 'preview:', fileItem.preview);
        if (fileItem.preview) {
          try {
            console.log(`[${effectivePlatform}] 从 blob URL 获取文件...`);
            const response = await fetch(fileItem.preview);
            const blob = await response.blob();
            console.log(`[${effectivePlatform}] 获取到 blob:`, blob.size, blob.type);
            const fileName = fileItem.name || 'upload';
            const file = new File([blob], fileName, { type: blob.type });
            console.log(`[${effectivePlatform}] 创建 File 对象:`, file.name, file.size);

            // 根据平台决定上传方式
            if (effectivePlatform === '星辰平台' || effectivePlatform === '星智平台') {
              // 星辰平台：文件上传接口不同，需要先上传获取 file_id
              const fileId = await uploadFileToXingchen(file, effectiveApiKey, effectiveBaseUrl, effectiveUser);
              if (fileId) {
                fileIds.push(fileId);
                console.log(`[${effectivePlatform}] 文件上传成功，fileId:`, fileId);
              }
            } else {
              // Dify 平台
              const fileId = await uploadFileToDify(file, effectiveApiKey, effectiveBaseUrl);
              if (fileId) {
                fileIds.push(fileId);
                console.log(`[${effectivePlatform}] 文件上传成功，fileId:`, fileId);
              }
            }
          } catch (error) {
            console.error(`[${effectivePlatform}] 文件转换失败:`, error);
          }
        }
      }
    }

    // 根据平台构建请求体
    const requestBody: Record<string, unknown> = {
      query,
      user: effectiveUser,
    };

    // 添加 inputs（Dify 使用 inputs，星辰平台使用 input_data）
    if (effectivePlatform === '星辰平台' || effectivePlatform === '星智平台') {
      requestBody.input_data = inputs;
    } else {
      requestBody.inputs = inputs;
    }

    // 添加 conversationId
    if (conversationId) {
      requestBody.conversation_id = conversationId;
    }

    // 添加文件参数（根据平台格式不同）
    if (fileIds.length > 0) {
      if (effectivePlatform === '星辰平台' || effectivePlatform === '星智平台') {
        // 星辰平台格式：files 数组
        requestBody.files = fileIds.map(id => ({
          type: 'image',
          transfer_method: 'local_file',
          upload_file_id: id,
        }));
        console.log(`[${effectivePlatform}] 添加 files 到请求:`, requestBody.files);
      } else {
        // Dify 格式：file_ids 数组
        requestBody.file_ids = fileIds;
        console.log(`[${effectivePlatform}] 添加 file_ids 到请求:`, fileIds);
      }
    } else {
      console.log(`[${effectivePlatform}] 没有上传的文件，fileIds 为空`);
    }

    // 根据平台设置响应模式
    if (effectivePlatform === '星辰平台' || effectivePlatform === '星智平台') {
      requestBody.mode = 'streaming';
    } else {
      requestBody.response_mode = 'streaming';
    }

    console.log(`[${effectivePlatform}] 发送 chat-messages 请求，请求体:`, JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${effectiveBaseUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('无法读取响应流');
    }

    const decoder = new TextDecoder();
    let buffer = '';
    let lastConversationId = conversationId || '';
    // 累积答案，用于处理分段发送
    let accumulatedAnswer = '';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 处理多行 SSE 数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          // 跳过 ping 事件和空数据
          if (!data || data === '[DIFY_LIVE_INSIGHT]') {
            continue;
          }

          try {
            const parsed = JSON.parse(data);
            console.log(`[Dify] 收到事件 ${parsed.event}:`, JSON.stringify(parsed));

            switch (parsed.event) {
              case 'agent_thought':
                // Agent 思考过程
                const thoughtContent = parsed.thought || '';
                console.log('[Dify] agent_thought thought 内容:', thoughtContent.slice(0, 500));
                const observationContent = parsed.observation?.trim() || '';
                const toolName = parsed.tool || '';
                const toolInput = parsed.tool_input || '';

                // 判断是否有明确的工具调用（必须有 tool_input）
                const hasToolInput = toolInput.length > 0;
                const isToolContent = observationContent.startsWith('{');

                // 判断是否是真正的工具调用：有 tool_input 字段
                const isRealToolCall = hasToolInput;

                // 提取所有 think 标签内容作为思考过程
                // 支持半角和全角括号的 think 标签
                const thinkBlocks: string[] = [];
                let lastEndIndex = 0;

                // 使用全局正则提取所有 think 标签内容
                const thinkRegex = /<think[>　]?([\s\S]*?)<\/think>/gi;
                let match;
                while ((match = thinkRegex.exec(thoughtContent)) !== null) {
                  const content = match[1].trim();
                  if (content) {
                    thinkBlocks.push(content);
                  }
                  lastEndIndex = Math.max(lastEndIndex, (match.index || 0) + match[0].length);
                }

                // 判断是否包含think标签
                const hasThinkTag = thinkBlocks.length > 0;

                // 清理 thought：只保留最后一个 think 标签之后的内容（不包含 think 标签内的内容）
                const cleanThought = thoughtContent.slice(lastEndIndex).trim();

                // 注：think 内容不在 parsed.thought 字段里（该字段为空），
                // 而是在 agent_message.answer 里分片发送。
                // 由下方 agent_message 分支保留 <think> 标签后写入 accumulatedAnswer，
                // 前端 renderMessageContent 统一提取显示。

                // 如果有工具调用，创建工具调用块
                if (hasToolInput) {
                  let request = undefined;
                  let response = undefined;

                  // 从 tool_input 中提取请求信息
                  try {
                    request = JSON.parse(toolInput);
                  } catch {
                    request = { raw: toolInput };
                  }

                  // 从 observation 中提取响应
                  if (isToolContent) {
                    try {
                      const parsedObs = JSON.parse(observationContent);
                      const toolResultKey = Object.keys(parsedObs)[0];
                      const toolResult = parsedObs[toolResultKey];
                      if (toolResult) {
                        try {
                          response = JSON.parse(toolResult);
                        } catch {
                          response = { result: toolResult };
                        }
                      }
                    } catch {
                      // 解析失败
                    }
                  }

                  if (onToolCall) {
                    onToolCall({
                      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                      toolName: toolName || '工具调用',
                      thought: cleanThought || undefined,
                      observation: undefined,
                      request: request,
                      response: response,
                      isRealToolCall: true,
                      // 记录当时 m.content 长度作为位置锚点
                      contentLength: accumulatedAnswer.length,
                    });
                  }
                  break;
                }

                // 如果有长文本内容（星辰平台的回复在 thought 中），当作消息发送
                if (cleanThought.length > 50 && !hasThinkTag) {
                  if (onMessage) {
                    onMessage(cleanThought, parsed.event);
                  }
                  break;
                }

                // 如果有观察内容
                if (observationContent.length > 0) {
                  if (onToolCall) {
                    console.log('[Dify] agent_thought 发送观察内容作为思考块:', observationContent.slice(0, 100));
                    onToolCall({
                      id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                      toolName: '思考中',
                      thought: undefined,
                      observation: observationContent,
                      request: undefined,
                      response: undefined,
                      isRealToolCall: false,
                    });
                  }
                  break;
                }

                // 其他情况跳过
                break;

              case 'agent_message':
              case 'message':
                // Dify 把 think 内容塞在 agent_message.answer 里分片发送（agent_thought 事件的
                // thought 字段是空的，不要再被它误导）。
                // 直接把 answer 原样 append 到 accumulatedAnswer，保留 <think> 标签，
                // 渲染时由前端 renderMessageContent 按字符串顺序提取 think 块（在上）+ 正文（在下）。
                if (parsed.answer) {
                  accumulatedAnswer += parsed.answer;
                  onMessage(accumulatedAnswer, parsed.event);
                }
                break;

              case 'message_replace':
                // 消息替换事件，用新内容替换旧内容
                if (parsed.answer) {
                  accumulatedAnswer = parsed.answer;
                  onMessage(accumulatedAnswer, parsed.event);
                }
                break;

              case 'message_end':
                // 对话结束，确保发送最终内容
                if (accumulatedAnswer) {
                  onMessage(accumulatedAnswer, 'message_end');
                }
                // 保存 conversation_id
                if (parsed.conversation_id) {
                  lastConversationId = parsed.conversation_id;
                }
                break;

              case 'error':
                onError(new Error(parsed.message || 'Dify 返回错误'));
                break;

              case 'tool_call':
                // 工具调用事件 - 包含工具输入输出信息
                console.log('[Dify] tool_call event:', JSON.stringify(parsed).slice(0, 500));
                break;

              case 'tool_call_begin':
                // 工具调用开始
                console.log('[Dify] tool_call_begin event:', JSON.stringify(parsed).slice(0, 500));
                break;

              case 'ping':
                // 忽略 ping
                break;
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }

    onComplete(lastConversationId);

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      // 用户取消了请求
      return controller;
    }
    onError(error instanceof Error ? error : new Error('未知错误'));
  }

  return controller;
}

/**
 * 获取对话历史列表
 */
export async function getConversations(apiKey: string, baseUrl: string, userId?: string): Promise<{ id: string; name: string; created_at: string }[]> {
  try {
    const params = new URLSearchParams({
      page: '1',
      limit: '20',
    });
    if (userId) {
      params.set('user', userId);
    }

    const response = await fetch(`${baseUrl}/conversations?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    console.log('[Dify] conversations API 响应状态:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('[Dify] conversations 数据:', data);
      return data.data || [];
    } else {
      const errorText = await response.text();
      console.error('[Dify] conversations API 错误:', response.status, errorText);
    }
    return [];
  } catch (error) {
    console.error('[Dify] 获取对话历史失败:', error);
    return [];
  }
}

/**
 * 获取对话详情和消息列表
 * API: GET /v1/messages?conversation_id=xxx&user=xxx&limit=20
 */
export async function getConversationMessages(apiKey: string, baseUrl: string, conversationId: string, userId?: string): Promise<{ id: string; role: string; content: string; created_at: string; answer?: string }[]> {
  try {
    const params = new URLSearchParams({
      conversation_id: conversationId,
      limit: '20',
    });
    if (userId) {
      params.set('user', userId);
    }

    const response = await fetch(`${baseUrl}/messages?${params}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Dify] messages API 错误:', response.status, errorText);
      return [];
    }

    const data = await response.json();
    console.log('[Dify] messages API 完整返回:', JSON.stringify(data, null, 2));

    // 转换 Dify 消息格式为统一格式
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((msg: any) => ({
        id: msg.id || '',
        role: msg.answer ? 'assistant' : 'user',
        content: msg.answer || msg.query || '',
        query: msg.query || '',  // 保留原始 query
        answer: msg.answer || '',  // 保留原始 answer
        created_at: msg.created_at ? new Date(msg.created_at * 1000).toISOString() : new Date().toISOString(),
      }));
    }
    return [];
  } catch (error) {
    console.error('[Dify] 获取消息历史失败:', error);
    return [];
  }
}

/**
 * 获取 Dify 应用信息
 */
export async function getAppInfo(): Promise<{ name: string; description: string } | null> {
  try {
    const response = await fetch(`${DIFY_CONFIG.baseUrl}/app-info`, {
      headers: {
        'Authorization': `Bearer ${DIFY_CONFIG.apiKey}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * 生成唯一的消息 ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 停止正在进行的对话
 */
export function stopDifyChat(controller: AbortController): void {
  controller.abort();
}

export default {
  sendDifyMessage,
  getAppInfo,
  getConversations,
  getConversationMessages,
  generateMessageId,
  stopDifyChat,
  uploadFileToXingchen,
  uploadFileToDify,
};