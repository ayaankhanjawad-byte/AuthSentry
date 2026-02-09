import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "./StatsCard";
import { ScanResultCard } from "./ScanResultCard";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Activity, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { ScanResult, ScanStats } from "@/types/scan";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function Dashboard() {
  const [stats, setStats] = useState<ScanStats | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch recent scans
      const { data: scans, error } = await supabase
        .from("scan_results")
        .select("*")
        .order("scanned_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      const typedScans: ScanResult[] = (scans || []).map(scan => ({
        id: scan.id,
        user_id: scan.user_id,
        scan_type: scan.scan_type as ScanResult['scan_type'],
        content: scan.content,
        subject: scan.subject || undefined,
        sender: scan.sender || undefined,
        risk_score: scan.risk_score,
        risk_level: scan.risk_level as ScanResult['risk_level'],
        threats_detected: Array.isArray(scan.threats_detected) 
          ? scan.threats_detected.map((t: unknown) => {
              const threat = t as Record<string, unknown>;
              return {
                type: String(threat.type || ''),
                description: String(threat.description || ''),
                severity: (threat.severity || 'suspicious') as ScanResult['risk_level'],
              };
            })
          : [],
        recommendations: Array.isArray(scan.recommendations) 
          ? scan.recommendations.map((r: unknown) => String(r))
          : [],
        analysis_details: typeof scan.analysis_details === 'object' && scan.analysis_details !== null
          ? scan.analysis_details as Record<string, unknown>
          : {},
        scanned_at: scan.scanned_at,
      }));

      setRecentScans(typedScans);

      // Calculate stats
      const totalScans = typedScans.length;
      const safeMessages = typedScans.filter((s) => s.risk_level === "safe").length;
      const suspiciousMessages = typedScans.filter((s) => s.risk_level === "suspicious").length;
      const dangerousMessages = typedScans.filter((s) => s.risk_level === "dangerous").length;

      setStats({
        totalScans,
        threatsDetected: suspiciousMessages + dangerousMessages,
        safeMessages,
        suspiciousMessages,
        dangerousMessages,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = stats
    ? [
        { name: "Safe", value: stats.safeMessages, color: "hsl(142, 71%, 45%)" },
        { name: "Suspicious", value: stats.suspiciousMessages, color: "hsl(38, 92%, 50%)" },
        { name: "Dangerous", value: stats.dangerousMessages, color: "hsl(0, 84%, 60%)" },
      ].filter((d) => d.value > 0)
    : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Scans"
          value={stats?.totalScans || 0}
          icon={Activity}
          description="Messages analyzed"
        />
        <StatsCard
          title="Safe Messages"
          value={stats?.safeMessages || 0}
          icon={ShieldCheck}
          variant="safe"
          description="No threats detected"
        />
        <StatsCard
          title="Suspicious"
          value={stats?.suspiciousMessages || 0}
          icon={ShieldAlert}
          variant="suspicious"
          description="Potential threats"
        />
        <StatsCard
          title="Dangerous"
          value={stats?.dangerousMessages || 0}
          icon={ShieldX}
          variant="dangerous"
          description="High-risk content"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
            <CardDescription>Overview of scan results by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [value, name]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {chartData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <Shield className="h-12 w-12 mb-4 opacity-20" />
                <p>No scans yet</p>
                <p className="text-sm">Start scanning messages to see results</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest analyzed messages</CardDescription>
          </CardHeader>
          <CardContent>
            {recentScans.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {recentScans.slice(0, 5).map((scan) => (
                  <ScanResultCard key={scan.id} result={scan} compact />
                ))}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                <TrendingUp className="h-12 w-12 mb-4 opacity-20" />
                <p>No recent activity</p>
                <p className="text-sm">Scan some messages to see history</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
