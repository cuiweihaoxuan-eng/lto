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

/**
 * 上传文件到星辰平台，获取 file_id
 * @param file - File 对象
 * @param apiKey - API 密钥
 * @param baseUrl - API 地址
 * @param user - 用户标识
 */
export async function uploadFileToXingchen(file: File, apiKey: string, baseUrl: string, user: string): Promise<string | null> {
  console.log('[星辰平台] 开始上传文件到:', `${baseUrl}/files/upload`);
  console.log('[星辰平台] 文件信息:', { name: file.name, size: file.size, type: file.type });

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

            switch (parsed.event) {
              case 'agent_thought':
                // Agent 思考过程
                const thoughtContent = parsed.thought?.trim() || '';
                const observationContent = parsed.observation?.trim() || '';
                const toolName = parsed.tool || '';
                const toolInput = parsed.tool_input || '';

                // 判断是否有明确的工具调用（必须同时有 tool_input 或 JSON 格式的 observation）
                const hasToolInput = toolInput.length > 0;
                const isToolContent = observationContent.startsWith('{');
                const isRealToolCall = hasToolInput || isToolContent;

                // 只有包含<think>标签的内容才进入思考模块
                const hasThinkTag = thoughtContent.includes('<think>') || thoughtContent.includes('<think');

                if (!isRealToolCall && !hasThinkTag) {
                  // 没有工具调用也没有think标签，跳过不处理
                  // 这些内容会在 agent_message/message 中返回
                  break;
                }

                let request = undefined;
                let response = undefined;

                // 从 tool_input 中提取请求信息（JSON 字符串格式）
                if (hasToolInput) {
                  try {
                    const parsedToolInput = JSON.parse(toolInput);
                    request = parsedToolInput;
                  } catch {
                    request = { raw: toolInput };
                  }
                }

                // 从 observation 中提取响应（如果是 JSON 格式）
                if (isToolContent) {
                  try {
                    const parsedObs = JSON.parse(observationContent);
                    const toolResultKey = Object.keys(parsedObs)[0];
                    const toolResult = parsedObs[toolResultKey];

                    if (toolResult) {
                      try {
                        const parsedResult = JSON.parse(toolResult);
                        response = parsedResult;
                      } catch {
                        response = { result: toolResult };
                      }
                    }
                  } catch {
                    // 解析失败，保持原始内容
                  }
                }

                // 清理 thought 中的 think 标签
                const cleanThought = thoughtContent
                  .replace(/<think>[\s\S]*?<\/think>/g, '')
                  .replace(/<think>[\s\S]*?<\/think>/g, '')
                  .trim();

                const toolCall: ToolCall = {
                  id: `tool_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
                  toolName: isRealToolCall ? (toolName || '工具调用') : '思考中',
                  thought: cleanThought || undefined,
                  observation: !isRealToolCall ? observationContent : undefined,
                  request: request,
                  response: response,
                  isRealToolCall: isRealToolCall,
                };

                if (onToolCall) {
                  onToolCall(toolCall);
                }
                break;

              case 'agent_message':
              case 'message':
                // 累积 answer 内容（可能是分段发送的）
                // 注意：如果answer包含think标签，说明是完整内容，需要过滤
                if (parsed.answer) {
                  accumulatedAnswer = parsed.answer; // 直接替换，不累积
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
                // 对话结束，保存 conversation_id
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
export async function getConversationMessages(apiKey: string, baseUrl: string, conversationId: string, userId?: string): Promise<{ id: string; role: string; content: string; created_at: string }[]> {
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

    // 转换 Dify 消息格式为统一格式
    if (data.data && Array.isArray(data.data)) {
      return data.data.map((msg: any) => ({
        id: msg.id || '',
        role: msg.answer ? 'assistant' : 'user',
        content: msg.answer || msg.query || '',
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