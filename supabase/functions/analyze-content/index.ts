import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface AnalysisRequest {
  content: string;
  type: "email" | "sms" | "url";
  subject?: string;
  sender?: string;
}

interface ThreatDetected {
  type: string;
  description: string;
  severity: "safe" | "suspicious" | "dangerous";
}

interface AnalysisResponse {
  risk_score: number;
  risk_level: "safe" | "suspicious" | "dangerous";
  threats_detected: ThreatDetected[];
  recommendations: string[];
  analysis_details: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { content, type, subject, sender }: AnalysisRequest = await req.json();

    if (!content || !type) {
      return new Response(
        JSON.stringify({ error: "Content and type are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a cybersecurity expert specializing in fraud detection. Analyze the provided ${type} content for potential threats including:

1. Phishing attempts (fake login pages, credential theft)
2. Social engineering (urgency, fear tactics, impersonation)
3. Suspicious URLs (typosquatting, shortened links, fake domains)
4. Scam indicators (too-good-to-be-true offers, lottery/prize scams)
5. Malware indicators (suspicious attachments, download requests)
6. Financial fraud (payment requests, bank verification scams)

Provide a comprehensive analysis with a risk score from 0-100 where:
- 0-30: Safe (no threats detected)
- 31-60: Suspicious (potential threats, proceed with caution)
- 61-100: Dangerous (high-risk, likely scam/phishing)

Be thorough but avoid false positives. Legitimate business communications should score low.`;

    const userPrompt = type === "url" 
      ? `Analyze this URL for security threats:\n\nURL: ${content}\n\nCheck for:\n- Typosquatting or lookalike domains\n- Known phishing/malware domains\n- Suspicious URL patterns\n- Missing HTTPS\n- URL shorteners hiding destination`
      : `Analyze this ${type} for fraud/phishing:\n\n${subject ? `Subject: ${subject}\n` : ""}${sender ? `From: ${sender}\n\n` : ""}Content:\n${content}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_content",
              description: "Return the fraud analysis results",
              parameters: {
                type: "object",
                properties: {
                  risk_score: {
                    type: "number",
                    description: "Risk score from 0-100",
                  },
                  threats_detected: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", description: "Type of threat (e.g., 'Phishing', 'Urgency Tactics', 'Suspicious URL')" },
                        description: { type: "string", description: "Detailed explanation of the threat" },
                        severity: { type: "string", enum: ["safe", "suspicious", "dangerous"] },
                      },
                      required: ["type", "description", "severity"],
                    },
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "Actionable safety recommendations",
                  },
                  analysis_summary: {
                    type: "string",
                    description: "Brief summary of the overall analysis",
                  },
                },
                required: ["risk_score", "threats_detected", "recommendations", "analysis_summary"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall || toolCall.function.name !== "analyze_content") {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    
    // Determine risk level based on score
    let risk_level: "safe" | "suspicious" | "dangerous";
    if (analysis.risk_score <= 30) {
      risk_level = "safe";
    } else if (analysis.risk_score <= 60) {
      risk_level = "suspicious";
    } else {
      risk_level = "dangerous";
    }

    const result: AnalysisResponse = {
      risk_score: Math.min(100, Math.max(0, Math.round(analysis.risk_score))),
      risk_level,
      threats_detected: analysis.threats_detected || [],
      recommendations: analysis.recommendations || [],
      analysis_details: {
        summary: analysis.analysis_summary,
        analyzed_at: new Date().toISOString(),
        content_type: type,
      },
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
