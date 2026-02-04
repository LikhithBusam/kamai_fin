import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, Loader2, CheckCircle, AlertCircle, Play, RefreshCw, Zap } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { apiService } from "@/services/api";

interface AnalysisStatus {
  user_id: string;
  status: "in_progress" | "completed" | "failed";
  agents_completed: number;
  total_agents: number;
  last_updated: string;
}

export const AIAnalysisStatus = () => {
  const { user, refreshData } = useApp();
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickLoading, setIsQuickLoading] = useState(false);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  const triggerAnalysis = async (quick: boolean = false) => {
    if (!user?.id) return;

    if (quick) {
      setIsQuickLoading(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      if (quick) {
        await apiService.spareBackend.triggerQuickAnalysis(user.id);
      } else {
        await apiService.spareBackend.triggerAnalysis(user.id);
      }
      // Start checking status after triggering
      checkStatus();
    } catch (error) {
      console.error("Failed to trigger analysis:", error);
    } finally {
      setIsLoading(false);
      setIsQuickLoading(false);
    }
  };

  // Auto-trigger analysis when user profile is complete
  useEffect(() => {
    const autoTriggerAnalysis = async () => {
      // Only auto-trigger once per session
      if (hasAutoTriggered) return;

      // Check if user has complete profile (occupation is set)
      if (user?.id && user?.occupation) {
        // Check if analysis was already run recently (stored in localStorage)
        const lastAnalysis = localStorage.getItem(`last_analysis_${user.id}`);
        const now = Date.now();
        const oneHour = 60 * 60 * 1000;

        // If no previous analysis or it's been more than an hour, auto-trigger quick analysis
        if (!lastAnalysis || (now - parseInt(lastAnalysis)) > oneHour) {
          setHasAutoTriggered(true);
          localStorage.setItem(`last_analysis_${user.id}`, String(now));

          console.log("[AI Analysis] Auto-triggering QUICK analysis for user with complete profile");
          triggerAnalysis(true); // Use quick analysis for auto-trigger
        } else {
          // Just check status if analysis was recent
          checkStatus();
        }
      }
    };

    autoTriggerAnalysis();
  }, [user?.id, user?.occupation, hasAutoTriggered]);

  const checkStatus = async () => {
    if (!user?.id) return;
    
    try {
      const status = await apiService.spareBackend.getAnalysisStatus(user.id);
      setAnalysisStatus(status);
      
      // If completed, refresh data
      if (status.status === "completed") {
        refreshData();
      }
      
      // If in progress, check again after 2 seconds
      if (status.status === "in_progress") {
        setTimeout(checkStatus, 2000);
      }
    } catch (error) {
      // No analysis running
      setAnalysisStatus(null);
    }
  };

  if (!user) {
    return null;
  }

  const progress = analysisStatus 
    ? (analysisStatus.agents_completed / analysisStatus.total_agents) * 100 
    : 0;

  const getStatusIcon = () => {
    if (!analysisStatus) return <Brain className="w-4 h-4" />;
    
    switch (analysisStatus.status) {
      case "in_progress":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Brain className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    if (!analysisStatus) {
      if (user?.occupation) {
        return "AI Analysis Starting...";
      }
      return "Complete your profile for AI insights";
    }

    switch (analysisStatus.status) {
      case "in_progress":
        return `Analyzing your finances (${analysisStatus.agents_completed}/${analysisStatus.total_agents} agents)`;
      case "completed":
        return "AI Analysis Complete";
      case "failed":
        return "AI Analysis Failed - Click to retry";
      default:
        return "AI Analysis Ready";
    }
  };

  const getStatusColor = () => {
    if (!analysisStatus) return "secondary";
    
    switch (analysisStatus.status) {
      case "in_progress":
        return "default";
      case "completed":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          AI Financial Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={getStatusColor()}>
            {getStatusText()}
          </Badge>
          <div className="flex gap-2">
            {/* Quick Analysis Button - 3 agents, ~1-2 min */}
            <button
              onClick={() => triggerAnalysis(true)}
              disabled={isLoading || isQuickLoading || analysisStatus?.status === "in_progress"}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 flex items-center gap-2"
              title="Quick analysis with 3 core agents (~1-2 min)"
            >
              {isQuickLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Quick...
                </>
              ) : (
                <>
                  <Zap className="w-3 h-3" />
                  Quick
                </>
              )}
            </button>
            {/* Full Analysis Button - 10 agents, ~5-8 min */}
            <button
              onClick={() => triggerAnalysis(false)}
              disabled={isLoading || isQuickLoading || analysisStatus?.status === "in_progress"}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
              title="Full analysis with all 10 agents (~5-8 min)"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Starting...
                </>
              ) : analysisStatus?.status === "in_progress" ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing...
                </>
              ) : analysisStatus?.status === "completed" ? (
                <>
                  <RefreshCw className="w-3 h-3" />
                  Full Re-run
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Full Analysis
                </>
              )}
            </button>
          </div>
        </div>
        
        {analysisStatus && analysisStatus.status === "in_progress" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{analysisStatus.agents_completed}/{analysisStatus.total_agents} agents</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}
        
        {analysisStatus && analysisStatus.status === "completed" && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
            ✓ Analysis complete! Check your recommendations and insights below.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAnalysisStatus;
