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

// 模拟的 AI 回复
const mockResponses = [
  "我来帮你分析一下这个问题。根据系统数据，当前项目的进展顺利，里程碑完成率为85%。",
  "好的，我来查一下相关的配置信息。六到位的执行情况显示，大部分节点都已完成，建议关注合同条款确认这个环节。",
  "根据你提供的信息，我建议先检查一下项目的基本信息是否完整，特别是客户需求和预算部分。",
  "我来帮你生成一份简报。当前项目毛利率为32%，略低于目标值，建议关注成本控制环节。",
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

    // 模拟 AI 回复
    setTimeout(() => {
      const responseIndex = Math.floor(Math.random() * mockResponses.length);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: mockResponses[responseIndex],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
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
          <div className="w-8 h-8 bg-[#1890ff] rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-700">AI 助手</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearChat}
            className="p-2 hover:bg-[#bae7ff] rounded-lg transition-colors"
            title="清空对话"
          >
            <Trash2 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#bae7ff] rounded-lg transition-colors"
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* 头像 */}
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                message.role === "user"
                  ? "bg-[#1890ff] text-white"
                  : "bg-gradient-to-br from-[#1890ff] to-[#40a9ff] text-white"
              }`}
            >
              {message.role === "user" ? (
                <User className="w-4 h-4" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            {/* 消息内容 */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-[#1890ff] text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {/* 文件附件 */}
              {message.files && message.files.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {message.files.map((file) => (
                    <div
                      key={file.id}
                      className={`flex items-center gap-2 px-2 py-1 rounded-lg text-xs ${
                        message.role === "user" ? "bg-[#1890ff] text-white" : "bg-gray-100 text-gray-600"
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
                <span className="w-2 h-2 bg-[#1890ff] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-[#1890ff] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-[#1890ff] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 输入区域 */}
      <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50 p-4">
        {/* 已上传文件预览 */}
        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border shadow-sm group"
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
            className="w-full px-4 py-3 pr-24 bg-white border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#1890ff] focus:border-transparent text-sm"
            rows={1}
            style={{ minHeight: 48, maxHeight: 120 }}
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