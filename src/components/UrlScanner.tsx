import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, Loader2, Sparkles, ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { RiskMeter } from "./RiskMeter";
import { RiskBadge } from "./RiskBadge";
import type { AnalysisResponse } from "@/types/scan";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_URLS = [
  "http://secure-paypa1.com/verify-account",
  "https://www.google.com",
  "http://bit.ly/free-iphone-2024",
  "https://github.com/microsoft/vscode",
];

export function UrlScanner() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const analyzeUrl = async () => {
    if (!url.trim()) {
      toast({
        title: "Empty URL",
        description: "Please enter a URL to analyze",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content: url, type: "url" },
      });

      if (error) throw error;

      setResult(data);

      // Save to database
      await supabase.from("scan_results").insert({
        scan_type: "url",
        content: url,
        risk_score: data.risk_score,
        risk_level: data.risk_level,
        threats_detected: data.threats_detected,
        recommendations: data.recommendations,
        analysis_details: data.analysis_details,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (sample: string) => {
    setUrl(sample);
    setResult(null);
  };

  const getUrlDetails = () => {
    try {
      const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
      return {
        protocol: urlObj.protocol,
        domain: urlObj.hostname,
        path: urlObj.pathname,
        isHttps: urlObj.protocol === "https:",
        isShortened: ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly"].some(
          (d) => urlObj.hostname.includes(d)
        ),
      };
    } catch {
      return null;
    }
  };

  const urlDetails = url ? getUrlDetails() : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Link2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">URL & Link Scanner</CardTitle>
            <CardDescription>
              Check any suspicious link for phishing, malware, or fake login pages
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter URL to scan (e.g., https://example.com)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && analyzeUrl()}
            />
            <Button onClick={analyzeUrl} disabled={isAnalyzing || !url.trim()}>
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try samples:</span>
            {SAMPLE_URLS.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => loadSample(sample)}
                className="text-xs h-7"
              >
                {new URL(sample).hostname.slice(0, 15)}
              </Button>
            ))}
          </div>
        </div>

        {urlDetails && (
          <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-1">
              {urlDetails.isHttps ? (
                <Shield className="h-3 w-3 text-safe" />
              ) : (
                <AlertTriangle className="h-3 w-3 text-dangerous" />
              )}
              <span className="text-xs">{urlDetails.isHttps ? "HTTPS" : "HTTP (Insecure)"}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <span className="text-xs font-mono">{urlDetails.domain}</span>
            {urlDetails.isShortened && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-xs text-suspicious">Shortened URL</span>
              </>
            )}
          </div>
        )}

        {isAnalyzing && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>
            <p className="text-sm text-muted-foreground">Scanning URL for threats...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-4 border-t animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Scan Result</h4>
              <RiskBadge riskLevel={result.risk_level} score={result.risk_score} />
            </div>

            <div className="flex justify-center py-4">
              <RiskMeter score={result.risk_score} riskLevel={result.risk_level} size="lg" />
            </div>

            {result.threats_detected.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Security Issues Found</h5>
                <div className="space-y-2">
                  {result.threats_detected.map((threat, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">{threat.type}</p>
                        <p className="text-xs text-muted-foreground">{threat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Safety Recommendations</h5>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
