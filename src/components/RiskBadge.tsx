import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, XCircle, CheckCircle } from "lucide-react";
import type { RiskLevel } from "@/types/scan";

interface RiskBadgeProps {
  riskLevel: RiskLevel;
  score?: number;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function RiskBadge({ riskLevel, score, showIcon = true, size = "md" }: RiskBadgeProps) {
  const getIcon = () => {
    switch (riskLevel) {
      case "safe":
        return <CheckCircle className={iconSizeClasses[size]} />;
      case "suspicious":
        return <AlertTriangle className={iconSizeClasses[size]} />;
      case "dangerous":
        return <XCircle className={iconSizeClasses[size]} />;
    }
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const getBgColor = () => {
    switch (riskLevel) {
      case "safe":
        return "bg-safe/10 text-safe border-safe/20";
      case "suspicious":
        return "bg-suspicious/10 text-suspicious border-suspicious/20";
      case "dangerous":
        return "bg-dangerous/10 text-dangerous border-dangerous/20";
    }
  };

  const getLabel = () => {
    switch (riskLevel) {
      case "safe":
        return "Safe";
      case "suspicious":
        return "Suspicious";
      case "dangerous":
        return "Dangerous";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        sizeClasses[size],
        getBgColor()
      )}
    >
      {showIcon && getIcon()}
      <span>{getLabel()}</span>
      {score !== undefined && <span className="opacity-75">({score})</span>}
    </span>
  );
}
