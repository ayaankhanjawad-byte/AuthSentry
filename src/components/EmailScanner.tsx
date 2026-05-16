import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Loader2, Sparkles } from "lucide-react";
import { RiskMeter } from "./RiskMeter";
import { RiskBadge } from "./RiskBadge";
import type { AnalysisResponse } from "@/types/scan";
import { getSupabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SAMPLE_EMAILS = [
  {
    content: "Dear valued customer, Your account has been compromised. Click here immediately to verify your identity and prevent suspension: http://paypa1-verify.xyz/secure",
  },
  {
    content: "Hi there, Your order #302-1234567 has shipped and will arrive by Friday. Track your package at amazon.com/track. Thank you for shopping with us!",
  },
  {
    content: "CONGRATULATIONS! You have been selected as our lucky winner of $5,000,000! To claim your prize, please send your full name, address, and bank account details within 24 hours.",
  },
];

export function EmailScanner() {
  const [content, setContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const { toast } = useToast();

  const analyzeEmail = async () => {
    if (!content.trim()) {
      toast({
        title: "Empty email",
        description: "Please enter email content to analyze",
        variant: "destructive",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Backend not configured",
        description: "Add your Supabase anon key (VITE_SUPABASE_PUBLISHABLE_KEY) in .env or Vercel, then redeploy.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content, type: "email" },
      });

      if (error) throw error;

      setResult(data);

      await supabase.from("scan_results").insert({
        scan_type: "email",
        content: content,
        risk_score: data.risk_score,
        risk_level: data.risk_level,
        threats_detected: data.threats_detected,
        recommendations: data.recommendations,
        analysis_details: data.analysis_details,
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadSample = (sample: typeof SAMPLE_EMAILS[0]) => {
    setContent(sample.content);
    setResult(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl">Email Scanner</CardTitle>
            <CardDescription>
              Paste email content to analyze for phishing and scam attempts
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Paste the email body here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-none"
          />

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try samples:</span>
            {SAMPLE_EMAILS.map((sample, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => loadSample(sample)}
                className="text-xs h-7"
              >
                Sample {index + 1}
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={analyzeEmail}
          disabled={isAnalyzing || !content.trim()}
          className="w-full gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Analyze Email
            </>
          )}
        </Button>

        {isAnalyzing && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="relative w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan-line" />
            </div>
            <p className="text-sm text-muted-foreground">
              AI is analyzing the email for threats...
            </p>
          </div>
        )}

        {result && (
          <div className="space-y-4 pt-4 border-t animate-fade-in">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Analysis Result</h4>
              <RiskBadge riskLevel={result.risk_level} score={result.risk_score} />
            </div>

            <div className="flex justify-center py-4">
              <RiskMeter score={result.risk_score} riskLevel={result.risk_level} size="lg" />
            </div>

            {result.threats_detected.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Threats Detected</h5>
                <div className="space-y-2">
                  {result.threats_detected.map((threat, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-destructive/5 border border-destructive/10"
                    >
                      <p className="text-sm font-medium text-destructive">
                        {threat.type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {threat.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium">Recommendations</h5>
                <ul className="space-y-1">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {rec}
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
