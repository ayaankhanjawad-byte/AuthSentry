import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/scan";

interface RiskMeterProps {
  score: number;
  riskLevel: RiskLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
}

export function RiskMeter({ 
  score, 
  riskLevel, 
  size = "md", 
  showLabel = true,
  animated = true 
}: RiskMeterProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-32 h-32",
    lg: "w-40 h-40",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const getRiskColor = () => {
    switch (riskLevel) {
      case "safe":
        return "stroke-safe";
      case "suspicious":
        return "stroke-suspicious";
      case "dangerous":
        return "stroke-dangerous";
    }
  };

  const getRiskBgColor = () => {
    switch (riskLevel) {
      case "safe":
        return "bg-safe/10";
      case "suspicious":
        return "bg-suspicious/10";
      case "dangerous":
        return "bg-dangerous/10";
    }
  };

  const getRiskTextColor = () => {
    switch (riskLevel) {
      case "safe":
        return "text-safe";
      case "suspicious":
        return "text-suspicious";
      case "dangerous":
        return "text-dangerous";
    }
  };

  const getPulseAnimation = () => {
    if (!animated) return "";
    switch (riskLevel) {
      case "safe":
        return "animate-pulse-safe";
      case "suspicious":
        return "animate-pulse-suspicious";
      case "dangerous":
        return "animate-pulse-dangerous";
    }
  };

  const getRiskLabel = () => {
    switch (riskLevel) {
      case "safe":
        return "Safe";
      case "suspicious":
        return "Suspicious";
      case "dangerous":
        return "Dangerous";
    }
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className={cn("relative flex flex-col items-center gap-2", sizeClasses[size])}>
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            className="stroke-muted"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={cn(getRiskColor(), "transition-all duration-1000")}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        {/* Center content */}
        <div 
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center rounded-full",
            getRiskBgColor(),
            getPulseAnimation()
          )}
          style={{ margin: "8px" }}
        >
          <span className={cn("font-bold", textSizeClasses[size], getRiskTextColor())}>
            {displayScore}
          </span>
        </div>
      </div>
      {showLabel && (
        <span className={cn("font-medium", labelSizeClasses[size], getRiskTextColor())}>
          {getRiskLabel()}
        </span>
      )}
    </div>
  );
}
