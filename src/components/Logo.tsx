"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-lg", container: "gap-1.5" },
    md: { icon: "w-8 h-8", text: "text-xl", container: "gap-2" },
    lg: { icon: "w-12 h-12", text: "text-3xl", container: "gap-3" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container} ${className}`}>
      {/* Logo Icon - Modern geometric design */}
      <div className={`${s.icon} relative`}>
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Background gradient circle */}
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>
          </defs>
          
          {/* Main circle */}
          <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
          
          {/* "24" text stylized */}
          <text
            x="20"
            y="24"
            textAnchor="middle"
            fill="white"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="14"
            fontWeight="800"
          >
            24
          </text>
          
          {/* Spark/lightning accent */}
          <path
            d="M28 8 L26 14 L30 14 L24 22 L26 16 L22 16 Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
      
      {showText && (
        <span className={`${s.text} font-bold tracking-tight`}>
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
            24fit
          </span>
        </span>
      )}
    </div>
  );
}

// Alternative minimal logo for favicon/small spaces
export function LogoMini({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="miniGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#miniGradient)" />
      <text
        x="16"
        y="20"
        textAnchor="middle"
        fill="white"
        fontFamily="system-ui"
        fontSize="11"
        fontWeight="800"
      >
        24
      </text>
    </svg>
  );
}
