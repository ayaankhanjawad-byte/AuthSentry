export type RiskLevel = 'safe' | 'suspicious' | 'dangerous';
export type ScanType = 'email' | 'sms' | 'url';

export interface ThreatDetected {
  type: string;
  description: string;
  severity: RiskLevel;
}

export interface ScanResult {
  id: string;
  user_id: string | null;
  scan_type: ScanType;
  content: string;
  subject?: string;
  sender?: string;
  risk_score: number;
  risk_level: RiskLevel;
  threats_detected: ThreatDetected[];
  recommendations: string[];
  analysis_details: Record<string, unknown>;
  scanned_at: string;
}

export interface ScanStats {
  totalScans: number;
  threatsDetected: number;
  safeMessages: number;
  suspiciousMessages: number;
  dangerousMessages: number;
}

export interface AnalysisResponse {
  risk_score: number;
  risk_level: RiskLevel;
  threats_detected: ThreatDetected[];
  recommendations: string[];
  analysis_details: Record<string, unknown>;
}
