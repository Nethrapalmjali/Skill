import { useState, useEffect } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  PlayCircle, 
  Clock, 
  Star, 
  Search,
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { motion } from "motion/react";

export default function Learning({ user }: { user: any }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const allCourses = await api.getCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error("Failed to fetch courses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.skills.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Learning Center</h2>
          <p className="text-slate-500 mt-1">Enhance your skills with curated courses and resources.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <Input 
            placeholder="Search courses, skills, or providers..." 
            className="pl-10 h-12 rounded-xl border-slate-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-50 rounded-3xl animate-pulse" />
          ))
        ) : (
          filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full group">
                <div className="h-40 bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-white/40" />
                  </div>
                  <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 border-none backdrop-blur-sm">
                    {course.level}
                  </Badge>
                </div>
                <CardContent className="p-6 flex-1">
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">{course.provider}</p>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      4.8
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="rounded-lg bg-slate-100 text-slate-600 font-normal border-none">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-indigo-600 transition-colors">
                    Start Learning
                    <PlayCircle className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <section className="bg-indigo-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
          <GraduationCap className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-bold mb-4">Ready to level up?</h3>
          <p className="text-indigo-100 text-lg mb-8">
            Complete assessments to unlock personalized course recommendations and get certified in your skills.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl h-12 px-8 font-bold">
            Explore Learning Paths
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
