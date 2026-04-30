import React, { useState } from "react";

interface FloatAIBtnProps {
  isOpen: boolean;
  onClick: () => void;
}

export function FloatAIBtn({ isOpen, onClick }: FloatAIBtnProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] cursor-pointer select-none transition-all duration-300 ${
        isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
      }`}
      style={{ width: 72, height: 72 }}
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
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 发光效果 */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* 投影 */}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.3" />
          </filter>

          {/* 渐变 - 身体 */}
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>

          {/* 渐变 - 脑袋 */}
          <linearGradient id="headGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#f5576c" />
          </linearGradient>

          {/* 渐变 - 屏幕 */}
          <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#16213e" />
          </linearGradient>

          {/* 渐变 - 天线 */}
          <linearGradient id="antennaGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffd700" />
            <stop offset="100%" stopColor="#ffec8b" />
          </linearGradient>

          {/* 眼睛发光 */}
          <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffff" />
            <stop offset="70%" stopColor="#00aaff" />
            <stop offset="100%" stopColor="#0066ff" />
          </radialGradient>

          {/* 按钮渐变 */}
          <linearGradient id="btnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        {/* 底座阴影 */}
        <ellipse
          cx="50"
          cy="92"
          rx="22"
          ry="6"
          fill="rgba(0,0,0,0.2)"
          className={`transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
        />

        {/* 身体 */}
        <g filter="url(#shadow)" className={`transition-transform duration-300 ${isHovered ? "translate-y-[-2px]" : ""}`}>
          {/* 身体主体 */}
          <path
            d="M30 75 Q25 60, 30 50 L35 45 Q40 35, 50 32 Q60 35, 65 45 L70 50 Q75 60, 70 75 Q60 82, 50 82 Q40 82, 30 75Z"
            fill="url(#bodyGradient)"
            className={`transition-all duration-200 ${isPressed ? "scale-95" : ""}`}
          />

          {/* 身体高光 */}
          <path
            d="M35 70 Q33 58, 36 48 L38 46 Q41 40, 48 38"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* 腹部屏幕 */}
          <rect
            x="38"
            y="52"
            width="24"
            height="18"
            rx="4"
            fill="url(#screenGradient)"
            stroke="#00d4ff"
            strokeWidth="1"
          />

          {/* 屏幕内容 - 波浪线表示思考中 */}
          {isHovered && (
            <g className="animate-pulse">
              <path
                d="M42 58 Q44 56, 46 58 T50 58 T54 58 T58 58"
                stroke="#00d4ff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M42 63 Q44 61, 46 63 T50 63 T54 63 T58 63"
                stroke="#00d4ff"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
              />
            </g>
          )}

          {/* 按钮装饰 */}
          <circle cx="44" cy="74" r="3" fill="#ff6b6b" />
          <circle cx="50" cy="76" r="2.5" fill="#4ecdc4" />
          <circle cx="56" cy="74" r="2.5" fill="#ffe66d" />

          {/* 左右手臂 */}
          <g className={`transition-transform duration-300 ${isHovered ? "animate-wiggle" : ""}`}
             style={{ transformOrigin: "50px 55px" }}>
            {/* 左手 */}
            <ellipse cx="26" cy="55" rx="6" ry="8" fill="url(#bodyGradient)" />
            <circle cx="26" cy="62" r="4" fill="#f093fb" />
          </g>

          {/* 右手 - 举起来打招呼 */}
          <g className={`transition-transform duration-300 ${isHovered ? "animate-wave" : ""}`}
             style={{ transformOrigin: "74px 55px" }}>
            <ellipse cx="74" cy="55" rx="6" ry="8" fill="url(#bodyGradient)" />
            <circle cx="74" cy="62" r="4" fill="#f093fb" />
          </g>
        </g>

        {/* 头部 */}
        <g
          className={`transition-transform duration-300 ${isHovered ? "translate-y-[-3px]" : ""}`}
          style={{
            transformOrigin: "50px 35px",
          }}
        >
          {/* 脑袋 */}
          <ellipse
            cx="50"
            cy="28"
            rx="20"
            ry="18"
            fill="url(#headGradient)"
            className={`transition-all duration-200 ${isPressed ? "scale-95" : ""}`}
          />

          {/* 脑袋高光 */}
          <ellipse
            cx="42"
            cy="20"
            rx="6"
            ry="4"
            fill="rgba(255,255,255,0.4)"
          />

          {/* 眼睛 */}
          <g className="animate-blink">
            {/* 左眼 */}
            <ellipse cx="42" cy="26" rx="6" ry={isHovered ? 7 : 6} fill="white" />
            <ellipse cx="42" cy="26" rx="4" ry={isHovered ? 5 : 4} fill="url(#eyeGlow)" filter="url(#glow)" />
            {/* 左眼瞳孔跟随 */}
            <circle cx={42 + (isHovered ? 1 : 0)} cy={26 + (isHovered ? -1 : 0)} r="2" fill="#001a33" />

            {/* 右眼 */}
            <ellipse cx="58" cy="26" rx="6" ry={isHovered ? 7 : 6} fill="white" />
            <ellipse cx="58" cy="26" rx="4" ry={isHovered ? 5 : 4} fill="url(#eyeGlow)" filter="url(#glow)" />
            {/* 右眼瞳孔跟随 */}
            <circle cx={58 + (isHovered ? -1 : 0)} cy={26 + (isHovered ? -1 : 0)} r="2" fill="#001a33" />
          </g>

          {/* 眼睫毛（可爱） */}
          <g stroke="#333" strokeWidth="0.5" fill="none" opacity="0.3">
            <path d="M36 20 Q38 18, 40 20" />
            <path d="M46 18 Q48 16, 50 18" />
            <path d="M56 18 Q58 16, 60 18" />
          </g>

          {/* 腮红 */}
          <ellipse cx="32" cy="32" rx="4" ry="3" fill="#ff9999" opacity="0.5" />
          <ellipse cx="68" cy="32" rx="4" ry="3" fill="#ff9999" opacity="0.5" />

          {/* 嘴巴 - 可爱微笑 */}
          <path
            d={isHovered ? "M44 34 Q50 40, 56 34" : "M44 35 Q50 38, 56 35"}
            stroke="#333"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* 天线 */}
          <line x1="50" y1="10" x2="50" y2="3" stroke="url(#antennaGradient)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="3" r="3" fill="#ffd700" filter="url(#glow)" className="animate-pulse" />
        </g>

        {/* Hover 时显示的特效 */}
        {isHovered && (
          <>
            {/* 爱心 */}
            <g className="animate-float-up opacity-0">
              <path
                d="M80 45 C82 43, 85 43, 85 46 C85 49, 80 52, 80 52 C80 52, 75 49, 75 46 C75 43, 78 43, 80 45"
                fill="#ff6b6b"
                className="animate-heartbeat"
              />
            </g>

            {/* 星星 */}
            <g className="animate-sparkle">
              <polygon
                points="85,30 86,33 89,33 87,35 88,38 85,36 82,38 83,35 81,33 84,33"
                fill="#ffd700"
                className="animate-twinkle"
              />
            </g>
          </>
        )}

        {/* 底部装饰 - 两只小脚 */}
        <ellipse cx="40" cy="85" rx="6" ry="4" fill="#764ba2" />
        <ellipse cx="60" cy="85" rx="6" ry="4" fill="#764ba2" />
      </svg>

      {/* CSS 动画 */}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }

        @keyframes wave {
          0%, 100% { transform: rotate(-10deg); }
          50% { transform: rotate(20deg); }
        }

        @keyframes blink {
          0%, 90%, 100% { transform: scaleY(1); }
          95% { transform: scaleY(0.1); }
        }

        @keyframes float-up {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          50% { transform: translateY(-10px) scale(1); opacity: 1; }
          100% { transform: translateY(-20px) scale(0.5); opacity: 0; }
        }

        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        @keyframes sparkle {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-10px, -15px) rotate(180deg); opacity: 0; }
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }

        .animate-blink {
          animation: blink 4s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-float-up {
          animation: float-up 1.5s ease-out forwards;
        }

        .animate-heartbeat {
          animation: heartbeat 0.6s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 1s ease-in-out infinite;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-out infinite;
        }
      `}</style>
    </div>
  );
}