import React, { useState, useCallback, DragEvent, useEffect, useRef } from "react";

interface ResizeDividerProps {
  onWidthChange: (width: number) => void;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
  visible: boolean;
}

export function ResizeDivider({
  onWidthChange,
  minWidth = 300,
  maxWidth = 600,
  defaultWidth = 400,
  visible,
}: ResizeDividerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(defaultWidth);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      // 计算新的宽度（从右侧计算）
      const newWidth = window.innerWidth - e.clientX;
      const clampedWidth = Math.min(Math.max(newWidth, minWidth), maxWidth);

      setCurrentWidth(clampedWidth);
      onWidthChange(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, minWidth, maxWidth, onWidthChange]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className={`relative flex-shrink-0 h-full group cursor-ew-resize transition-all duration-200 ${
        isDragging ? "bg-[#1890ff]/20" : "hover:bg-[#1890ff]/10"
      }`}
      style={{ width: 6 }}
      onMouseDown={handleMouseDown}
    >
      {/* 分隔线 */}
      <div
        className={`absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 transition-all duration-200 rounded-full ${
          isDragging
            ? "bg-[#1890ff]"
            : "bg-[#bae7ff] group-hover:bg-[#1890ff]"
        }`}
      />

      {/* 悬停指示器 */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
          isDragging || isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-5 h-14 bg-white border-2 border-[#1890ff] rounded-lg shadow-lg flex flex-col items-center justify-center gap-1.5 p-1.5">
          <div className="w-1 h-1.5 bg-[#1890ff] rounded-full" />
          <div className="w-1 h-1.5 bg-[#1890ff] rounded-full" />
          <div className="w-1 h-1.5 bg-[#1890ff] rounded-full" />
        </div>
      </div>
    </div>
  );
}