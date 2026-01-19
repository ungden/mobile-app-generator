"use client";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { dot: "w-1.5 h-1.5", text: "text-base", container: "gap-1.5" },
    md: { dot: "w-2 h-2", text: "text-lg", container: "gap-2" },
    lg: { dot: "w-2.5 h-2.5", text: "text-2xl", container: "gap-2.5" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center ${s.container} ${className}`}>
      {/* Simple dot logo - clean like Rork */}
      <div className={`${s.dot} rounded-full bg-white`} />
      
      {showText && (
        <span className={`${s.text} font-semibold tracking-tight text-white`}>
          24fit
        </span>
      )}
    </div>
  );
}

// Gradient version for special uses
export function LogoGradient({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: { icon: "w-6 h-6", text: "text-base" },
    md: { icon: "w-8 h-8", text: "text-lg" },
    lg: { icon: "w-10 h-10", text: "text-xl" },
  };

  const s = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${s.icon} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center`}>
        <span className="text-white font-bold text-xs">24</span>
      </div>
      <span className={`${s.text} font-semibold text-white`}>24fit</span>
    </div>
  );
}
