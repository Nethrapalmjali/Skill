import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { getJobMatches } from "@/src/lib/gemini";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Search, 
  Sparkles, 
  ChevronRight,
  Filter
} from "lucide-react";
import { motion } from "motion/react";

export default function Jobs({ user }: { user: any }) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const allJobs = await api.getJobs();
      setJobs(allJobs);
      if (user) {
        const aiMatches = await getJobMatches(user, allJobs);
        setMatches(aiMatches);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchInfo = (jobId: string) => {
    return matches.find(m => m.jobId === jobId);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Job Portal</h2>
          <p className="text-slate-500 mt-1">Find opportunities that match your unique skill set.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Search by title, company, or skills..." 
            className="pl-10 h-12 rounded-xl border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 border-slate-200">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-slate-50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          filteredJobs.map((job, i) => {
            const matchInfo = getMatchInfo(job.id);
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                            <Briefcase className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                            <p className="text-slate-600 font-medium">{job.company}</p>
                          </div>
                        </div>
                        {matchInfo && (
                          <div className="text-right">
                            <Badge className="bg-indigo-50 text-indigo-700 border-none px-3 py-1 rounded-full mb-1">
                              <Sparkles className="w-3 h-3 mr-1" />
                              {matchInfo.matchScore}% Match
                            </Badge>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-6">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill: string) => (
                          <Badge key={skill} variant="outline" className="rounded-lg border-slate-200 text-slate-600 font-normal">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {matchInfo && (
                        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                          <p className="text-sm text-indigo-800 font-medium flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            AI Insight:
                          </p>
                          <p className="text-sm text-indigo-700/80 mt-1 leading-relaxed">{matchInfo.reason}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-slate-50 p-6 md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-slate-100">
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl mb-3">
                        Apply Now
                      </Button>
                      <Button variant="outline" className="w-full rounded-xl border-slate-200">
                        Save Job
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
        {!isLoading && filteredJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">No jobs found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
