import { useState, useEffect } from "react";
import { getSkillRecommendations, getResumeSuggestions } from "@/src/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  BookOpen,
  Briefcase
} from "lucide-react";
import { motion } from "motion/react";

export default function Dashboard({ user, token, onTabChange }: { user: any, token: string, onTabChange: (tab: string) => void }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAIInsights();
    }
  }, [user]);

  const fetchAIInsights = async () => {
    setIsLoading(true);
    try {
      const [recs, sugs] = await Promise.all([
        getSkillRecommendations(user),
        getResumeSuggestions(user)
      ]);
      setRecommendations(recs);
      setSuggestions(sugs);
    } catch (error) {
      console.error("Failed to fetch AI insights", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user?.name}! 👋</h2>
          <p className="text-slate-500 mt-1">Here's what's happening with your career growth today.</p>
        </div>
        <Button onClick={() => onTabChange("assessment")} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl h-11 px-6">
          <Plus className="w-4 h-4 mr-2" />
          New Assessment
        </Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <Badge className="bg-white/20 text-white border-none hover:bg-white/30">Level 4</Badge>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Skill Score</h3>
            <p className="text-4xl font-bold mt-1">780</p>
            <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white w-[78%] rounded-full" />
            </div>
            <p className="text-xs mt-2 opacity-70">Top 15% of users in your field</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Job Matches</h3>
            <p className="text-4xl font-bold text-slate-900 mt-1">12</p>
            <p className="text-sm text-slate-500 mt-2">4 new matches since yesterday</p>
            <Button variant="link" onClick={() => onTabChange("jobs")} className="p-0 h-auto text-indigo-600 mt-2">
              View matches <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Courses</h3>
            <p className="text-4xl font-bold text-slate-900 mt-1">3</p>
            <p className="text-sm text-slate-500 mt-2">2 courses in progress</p>
            <Button variant="link" onClick={() => onTabChange("learning")} className="p-0 h-auto text-indigo-600 mt-2">
              Continue learning <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                AI Skill Recommendations
              </CardTitle>
              <CardDescription>Personalized learning paths for you</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-900">{rec.skill}</h4>
                        <p className="text-sm text-slate-500 mt-1">{rec.reason}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-50 rounded-lg">
                        Learn
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                Profile Improvements
              </CardTitle>
              <CardDescription>Boost your visibility to recruiters</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {suggestions.map((suggestion, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="mt-1">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">{suggestion}</p>
                  </motion.div>
                ))}
              </div>
            )}
            <Button className="w-full mt-6 rounded-xl border-slate-200" variant="outline" onClick={() => onTabChange("profile")}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
