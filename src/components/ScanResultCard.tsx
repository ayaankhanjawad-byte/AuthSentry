import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RiskBadge } from "./RiskBadge";
import { Mail, MessageSquare, Link, Clock, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ScanResult } from "@/types/scan";
import { cn } from "@/lib/utils";

interface ScanResultCardProps {
  result: ScanResult;
  onClick?: () => void;
  compact?: boolean;
}

export function ScanResultCard({ result, onClick, compact = false }: ScanResultCardProps) {
  const getIcon = () => {
    switch (result.scan_type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "url":
        return <Link className="h-4 w-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (result.scan_type) {
      case "email":
        return "Email";
      case "sms":
        return "SMS/Text";
      case "url":
        return "URL";
    }
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.slice(0, maxLength) + "...";
  };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-4 p-4 rounded-lg border bg-card transition-colors",
          onClick && "cursor-pointer hover:bg-accent/50"
        )}
      >
        <div className="flex-shrink-0 p-2 rounded-lg bg-muted">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{getTypeLabel()}</span>
            {result.subject && (
              <span className="text-sm text-muted-foreground truncate">
                - {result.subject}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {truncateContent(result.content, 60)}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <RiskBadge riskLevel={result.risk_level} score={result.risk_score} size="sm" />
          {onClick && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>
    );
  }

  return (
    <Card
      onClick={onClick}
      className={cn(
        "overflow-hidden transition-all",
        onClick && "cursor-pointer hover:shadow-md hover:border-primary/20"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {getIcon()}
            </div>
            <div>
              <h4 className="font-medium">{getTypeLabel()} Scan</h4>
              {result.sender && (
                <p className="text-sm text-muted-foreground">From: {result.sender}</p>
              )}
            </div>
          </div>
          <RiskBadge riskLevel={result.risk_level} score={result.risk_score} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {result.subject && (
          <div>
            <p className="text-sm font-medium">Subject</p>
            <p className="text-sm text-muted-foreground">{result.subject}</p>
          </div>
        )}
        <div>
          <p className="text-sm font-medium">Content Preview</p>
          <p className="text-sm text-muted-foreground">
            {truncateContent(result.content)}
          </p>
        </div>
        {result.threats_detected.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Threats Detected</p>
            <div className="flex flex-wrap gap-1">
              {result.threats_detected.slice(0, 3).map((threat, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive"
                >
                  {threat.type}
                </span>
              ))}
              {result.threats_detected.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{result.threats_detected.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
          <Clock className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(result.scanned_at), { addSuffix: true })}</span>
        </div>
      </CardContent>
    </Card>
  );
}
