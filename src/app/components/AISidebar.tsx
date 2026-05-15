import React, { useState, useRef, useEffect, KeyboardEvent, DragEvent } from "react";
import { X, Send, Paperclip, Image, Sparkles, User, ChevronDown, Trash2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  files?: FileItem[];
}

interface FileItem {
  id: string;
  name: string;
  type: "image" | "file";
  preview?: string;
}

interface AISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

// Mock AI 回复（流式输出模拟）
const mockResponses = [
  "我来帮你分析一下这个问题。根据系统数据，当前项目的进展顺利，里程碑完成率为85%，建议持续关注关键路径上的任务执行情况。",
  "好的，我来查一下相关的配置信息。六到位的执行情况显示，大部分节点都已完成，建议关注合同条款确认这个环节，确保万无一失。",
  "根据你提供的信息，我建议先检查一下项目的基本信息是否完整，特别是客户需求和预算部分，这些是项目成功的关键因素。",
  "我来帮你生成一份简报。当前项目毛利率为32%，略低于目标值35%，建议关注成本控制环节，加强预算执行的监控力度。",
];

export function AISidebar({ isOpen, onClose, width = 400 }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是 AI 助手，可以帮你分析数据、解答问题、生成报表。有什么可以帮你的吗？",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<FileItem[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyCollapsed, setHistoryCollapsed] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 自动调整文本框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputValue]);

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;

    // 构建文件描述
    const filesDesc = attachedFiles.length > 0
      ? attachedFiles.map(f => `[${f.type === "image" ? "图片" : "文件"}: ${f.name}]`).join(" ")
      : "";

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim() + (filesDesc ? `\n\n${filesDesc}` : ""),
      timestamp: new Date(),
      files: attachedFiles.length > 0 ? attachedFiles : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachedFiles([]);
    setIsTyping(true);

    // 创建 AI 消息占位（流式追加内容）
    const aiMessageId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, {
      id: aiMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    }]);

    // 模拟流式输出
    const responseText = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    let currentIndex = 0;

    const streamInterval = setInterval(() => {
      if (currentIndex < responseText.length) {
        // 每次追加 2-4 个字符，模拟真实流式输出
        const chunkSize = Math.floor(Math.random() * 3) + 2;
        const chunk = responseText.slice(currentIndex, currentIndex + chunkSize);
        currentIndex += chunkSize;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMessageId
              ? { ...m, content: m.content + chunk }
              : m
          )
        );
      } else {
        clearInterval(streamInterval);
        setIsTyping(false);
      }
    }, 50); // 每 50ms 输出一次
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const fileItem: FileItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: isImage ? "image" : "file",
        preview: isImage ? URL.createObjectURL(file) : undefined,
      };
      setAttachedFiles((prev) => [...prev, fileItem]);
    });
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => {
      const file = prev.find((f) => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "对话已清空。有什么可以帮你的吗？",
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`h-full flex flex-col transition-all duration-300 ease-in-out z-[9998] bg-white`}
      style={{ width }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {/* 拖拽覆盖层 */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-50/90 z-50 flex items-center justify-center border-4 border-dashed border-blue-400 rounded-lg m-4">
          <div className="text-center">
            <Image className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-600 font-medium">将文件拖放到这里上传</p>
          </div>
        </div>
      )}

      {/* 头部 */}
      <div className="flex-shrink-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 1024 1024" width="24" height="24">
            <path
              d="M493.226667 152.519111l9.386666 34.247111 0.170667 1.024 41.528889 140.344889 132.892444 0.113778a170.382222 170.382222 0 0 1 170.097778 160.256l0.284445 10.012444v11.377778A51.370667 51.370667 0 0 1 910.222222 559.786667v70.200889a51.2 51.2 0 0 1-62.577778 49.948444v23.153778a170.325333 170.325333 0 0 1-170.439111 170.268444H306.005333a170.382222 170.382222 0 0 1-170.439111-170.268444v-25.031111A59.335111 59.335111 0 0 1 56.888889 621.909333v-54.044444A59.278222 59.278222 0 0 1 135.566222 512v-13.482667A170.325333 170.325333 0 0 1 306.062222 328.192h160.711111L436.906667 227.157333l-107.633778 27.989334a22.414222 22.414222 0 0 1-27.306667-15.815111l-9.272889-34.247112a22.357333 22.357333 0 0 1 16.042667-27.477333l157.354667-40.96a22.414222 22.414222 0 0 1 27.306666 15.758222l-0.113777 0.056889z m183.978666 234.951111H306.005333a111.160889 111.160889 0 0 0-111.217777 111.047111v204.572445c0 61.326222 49.777778 110.990222 111.217777 110.990222h371.256889a111.104 111.104 0 0 0 111.217778-110.990222V498.517333a111.104 111.104 0 0 0-111.217778-111.047111h-0.056889z m-363.52 130.958222a29.582222 29.582222 0 0 1 29.297778 25.258667l0.341333 4.380445v118.385777A29.582222 29.582222 0 0 1 284.444444 670.833778l-0.341333-4.380445V548.067556a29.582222 29.582222 0 0 1 29.582222-29.582223z m363.747556-1.422222a28.785778 28.785778 0 0 1 40.732444 40.732445l-38.286222 38.229333 38.627556 38.570667a28.728889 28.728889 0 0 1 0.967111 39.594666l-1.024 1.137778a28.842667 28.842667 0 0 1-39.651556 0.967111l-1.024-1.024-56.433778-56.32a28.672 28.672 0 0 1-2.730666-43.178666l58.823111-58.709334zM571.619556 113.777778a41.528889 41.528889 0 1 1 0 83.114666h-0.113778a41.528889 41.528889 0 0 1 0-83.114666h0.113778z"
              fill="var(--color-primary)"
            />
          </svg>
          <span className="font-semibold text-gray-700">AI 助手</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-primary-light)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* 对话历史折叠区 */}
      <div className="border-b border-gray-100">
        <button
          onClick={() => setHistoryCollapsed(!historyCollapsed)}
          className="w-full px-4 py-2 flex items-center justify-between text-sm text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <span>对话历史</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${historyCollapsed ? "" : "rotate-180"}`}
          />
        </button>
        {!historyCollapsed && (
          <div className="px-4 pb-2 space-y-1">
            {["商机分析对话", "六到位配置咨询", "报表生成记录"].map((title, idx) => (
              <button
                key={idx}
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg truncate"
              >
                {title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* 头像 */}
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[#3b82f6]"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <svg viewBox="0 0 1024 1024" width="20" height="20">
                  <path
                    d="M493.226667 152.519111l9.386666 34.247111 0.170667 1.024 41.528889 140.344889 132.892444 0.113778a170.382222 170.382222 0 0 1 170.097778 160.256l0.284445 10.012444v11.377778A51.370667 51.370667 0 0 1 910.222222 559.786667v70.200889a51.2 51.2 0 0 1-62.577778 49.948444v23.153778a170.325333 170.325333 0 0 1-170.439111 170.268444H306.005333a170.382222 170.382222 0 0 1-170.439111-170.268444v-25.031111A59.335111 59.335111 0 0 1 56.888889 621.909333v-54.044444A59.278222 59.278222 0 0 1 135.566222 512v-13.482667A170.325333 170.325333 0 0 1 306.062222 328.192h160.711111L436.906667 227.157333l-107.633778 27.989334a22.414222 22.414222 0 0 1-27.306667-15.815111l-9.272889-34.247112a22.357333 22.357333 0 0 1 16.042667-27.477333l157.354667-40.96a22.414222 22.414222 0 0 1 27.306666 15.758222l-0.113777 0.056889z m183.978666 234.951111H306.005333a111.160889 111.160889 0 0 0-111.217777 111.047111v204.572445c0 61.326222 49.777778 110.990222 111.217777 110.990222h371.256889a111.104 111.104 0 0 0 111.217778-110.990222V498.517333a111.104 111.104 0 0 0-111.217778-111.047111h-0.056889z m-363.52 130.958222a29.582222 29.582222 0 0 1 29.297778 25.258667l0.341333 4.380445v118.385777A29.582222 29.582222 0 0 1 284.444444 670.833778l-0.341333-4.380445V548.067556a29.582222 29.582222 0 0 1 29.582222-29.582223z m363.747556-1.422222a28.785778 28.785778 0 0 1 40.732444 40.732445l-38.286222 38.229333 38.627556 38.570667a28.728889 28.728889 0 0 1 0.967111 39.594666l-1.024 1.137778a28.842667 28.842667 0 0 1-39.651556 0.967111l-1.024-1.024-56.433778-56.32a28.672 28.672 0 0 1-2.730666-43.178666l58.823111-58.709334zM571.619556 113.777778a41.528889 41.528889 0 1 1 0 83.114666h-0.113778a41.528889 41.528889 0 0 1 0-83.114666h0.113778z"
                    fill="#ffffff"
                  />
                </svg>
              )}
            </div>

            {/* 消息内容 */}
            <div
              className={`max-w-[85%] rounded-xl px-3 py-2 ${
                message.role === "user"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* 文件附件 */}
              {message.files && message.files.length > 0 && (
                <div className="mb-1.5 flex flex-wrap gap-1">
                  {message.files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${
                        message.role === "user" ? "bg-[var(--color-primary)] text-white" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {file.type === "image" ? (
                        <Image className="w-3 h-3" />
                      ) : (
                        <Paperclip className="w-3 h-3" />
                      )}
                      <span className="truncate max-w-[100px]">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 文本内容 */}
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

              {/* 时间戳 */}
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-blue-200" : "text-gray-400"
                }`}
              >
                {message.timestamp.toLocaleTimeString("zh-CN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}

        {/* 正在输入指示器 */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1890ff] to-[#40a9ff] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 p-3">
        {/* 已上传文件预览 */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded border group"
              >
                {file.type === "image" && file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <Paperclip className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-600 max-w-[100px] truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 输入框 */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息，Shift+Enter 换行，Enter 发送..."
            className="w-full px-3 py-2 pr-20 bg-white border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#1890ff] focus:border-transparent text-sm"
            rows={1}
            style={{ minHeight: 40, maxHeight: 100 }}
          />

          {/* 工具按钮 */}
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="上传文件"
            >
              <Paperclip className="w-4 h-4 text-gray-400" />
            </button>
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="上传图片"
            >
              <Image className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

              </div>
    </div>
  );
}