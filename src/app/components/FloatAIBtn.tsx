import React, { useState } from "react";

interface FloatAIBtnProps {
  isOpen: boolean;
  onClick: () => void;
}

export function FloatAIBtn({ isOpen, onClick }: FloatAIBtnProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [blinkFrame, setBlinkFrame] = useState(0);

  // 随机眨眼
  React.useEffect(() => {
    const timer = setInterval(() => {
      setBlinkFrame(1);
      setTimeout(() => setBlinkFrame(0), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, []);

  const eyeScale = blinkFrame ? 0.1 : isHovered ? 1 : 1;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[9999] cursor-pointer select-none transition-all duration-300 ${
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ width: 80, height: 80 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      <svg
        viewBox="0 0 120 120"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 柔和发光 */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 头部渐变 */}
          <linearGradient id="headFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8f0ff" />
          </linearGradient>

          {/* 头部阴影 */}
          <radialGradient id="headShadow" cx="50%" cy="100%" r="60%">
            <stop offset="0%" stopColor="#b8d4f0" />
            <stop offset="100%" stopColor="#8fb8e8" />
          </radialGradient>

          {/* 蓝色光晕 */}
          <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </radialGradient>

          {/* 眼睛高光 */}
          <radialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#93c5fd" />
          </radialGradient>
        </defs>

        {/* 底部投影 */}
        <ellipse
          cx="60"
          cy="118"
          rx="35"
          ry="8"
          fill="#94a3b8"
          opacity="0.3"
          className={`transition-all duration-500 ${isHovered ? "opacity-50 scale-110" : ""}`}
        />

        {/* 悬停时的蓝色光晕背景 */}
        <circle
          cx="60"
          cy="55"
          r="55"
          fill={isHovered ? "url(#blueGlow)" : "transparent"}
          className="transition-all duration-500"
        />

        {/* 头部主体 */}
        <g
          className={`transition-transform duration-300 ${
            isPressed ? "scale-95" : isHovered ? "scale-105" : "scale-100"
          }`}
          style={{ transformOrigin: "60px 60px" }}
        >
          {/* 头部阴影/轮廓 */}
          <ellipse
            cx="60"
            cy="58"
            rx="42"
            ry="40"
            fill="url(#headShadow)"
          />

          {/* 头部 */}
          <ellipse
            cx="60"
            cy="55"
            rx="40"
            ry="38"
            fill="url(#headFill)"
          />

          {/* 顶部高光 */}
          <ellipse
            cx="50"
            cy="32"
            rx="18"
            ry="10"
            fill="white"
            opacity="0.6"
          />

          {/* 左边耳朵（蓝色圆角方块） */}
          <rect
            x="18"
            y="42"
            width="10"
            height="14"
            rx="3"
            fill="#3b82f6"
            className={`transition-transform duration-300 ${isHovered ? "-translate-x-1" : ""}`}
            style={{ transformOrigin: "23px 49px" }}
          />

          {/* 右边耳朵 */}
          <rect
            x="92"
            y="42"
            width="10"
            height="14"
            rx="3"
            fill="#3b82f6"
            className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
            style={{ transformOrigin: "97px 49px" }}
          />

          {/* 左眼 */}
          <g className="transition-transform duration-200" style={{ transform: isHovered ? "translateY(-1px)" : "" }}>
            {/* 眼白 */}
            <ellipse
              cx="45"
              cy="52"
              rx={isHovered ? 9 : 8}
              ry={eyeScale}
              fill="white"
            />
            {/* 虹膜 */}
            <ellipse
              cx="45"
              cy={52 + (isHovered ? 0.5 : 0)}
              rx="5"
              ry={eyeScale * 5}
              fill="#1e40af"
            />
            {/* 瞳孔 */}
            <circle
              cx="45"
              cy={52 + (isHovered ? 0.5 : 0)}
              r="2.5"
              fill="#1e3a5f"
            />
            {/* 眼神光 */}
            <circle
              cx="43"
              cy={50 + (isHovered ? 0.5 : 0)}
              r="1.5"
              fill="white"
              opacity="0.9"
            />
          </g>

          {/* 右眼 */}
          <g className="transition-transform duration-200" style={{ transform: isHovered ? "translateY(-1px)" : "" }}>
            <ellipse
              cx="75"
              cy="52"
              rx={isHovered ? 9 : 8}
              ry={eyeScale}
              fill="white"
            />
            <ellipse
              cx="75"
              cy={52 + (isHovered ? 0.5 : 0)}
              rx="5"
              ry={eyeScale * 5}
              fill="#1e40af"
            />
            <circle
              cx="75"
              cy={52 + (isHovered ? 0.5 : 0)}
              r="2.5"
              fill="#1e3a5f"
            />
            <circle
              cx="73"
              cy={50 + (isHovered ? 0.5 : 0)}
              r="1.5"
              fill="white"
              opacity="0.9"
            />
          </g>

          {/* 腮红 - 左 */}
          <ellipse
            cx="30"
            cy="62"
            rx="8"
            ry="5"
            fill="#93c5fd"
            opacity={isHovered ? 0.6 : 0.3}
            className="transition-all duration-300"
          />

          {/* 腮红 - 右 */}
          <ellipse
            cx="90"
            cy="62"
            rx="8"
            ry="5"
            fill="#93c5fd"
            opacity={isHovered ? 0.6 : 0.3}
            className="transition-all duration-300"
          />

          {/* 嘴巴 */}
          <path
            d={isHovered ? "M50 70 Q60 78, 70 70" : "M52 70 Q60 74, 68 70"}
            stroke="#64748b"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* 悬停时的星星装饰 */}
          {isHovered && (
            <>
              <g className="animate-star1">
                <polygon
                  points="95,25 97,29 101,29 98,32 99,36 95,34 91,36 92,32 89,29 93,29"
                  fill="#60a5fa"
                />
              </g>
              <g className="animate-star2">
                <polygon
                  points="25,30 26.5,33 30,33 27.5,35.5 28.5,39 25,37 21.5,39 22.5,35.5 20,33 23.5,33"
                  fill="#93c5fd"
                />
              </g>
            </>
          )}
        </g>

        {/* 底部小光环 */}
        <ellipse
          cx="60"
          cy="98"
          rx="20"
          ry="4"
          fill="#94a3b8"
          opacity="0.2"
        />
      </svg>

      {/* CSS 动画 */}
      <style>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @keyframes starFloat {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(5px, -15px) rotate(20deg); opacity: 0; }
        }

        .animate-star1 {
          animation: starFloat 1.5s ease-out infinite;
        }

        .animate-star2 {
          animation: starFloat 1.5s ease-out 0.5s infinite;
        }
      `}</style>
    </div>
  );
}