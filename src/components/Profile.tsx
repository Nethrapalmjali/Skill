import { useState } from "react";
import { api } from "@/src/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Plus, Save, User as UserIcon, GraduationCap, Brain } from "lucide-react";
import { toast } from "sonner";

export default function Profile({ user, token, onUpdate }: { user: any, token: string, onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    education: user?.education || "",
    skills: user?.skills || [],
    interests: user?.interests || []
  });
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleSave = async () => {
    try {
      await api.updateProfile(token, formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s: string) => s !== skill) });
  };

  const addInterest = () => {
    if (newInterest && !formData.interests.includes(newInterest)) {
      setFormData({ ...formData, interests: [...formData.interests, newInterest] });
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({ ...formData, interests: formData.interests.filter((i: string) => i !== interest) });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Your Profile</h2>
          <p className="text-slate-500 mt-1">Manage your professional information and skills.</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl">
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={() => setIsEditing(false)} variant="ghost" className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 rounded-xl">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
            <div className="h-24 bg-indigo-600" />
            <CardContent className="pt-0 flex flex-col items-center -mt-12">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden mb-4">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
              <p className="text-slate-500 text-sm">{user?.email}</p>
              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center gap-3 text-slate-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm">{user?.education || "No education listed"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm">{user?.skills?.length || 0} Skills listed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-indigo-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Input 
                    id="education" 
                    value={formData.education} 
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g. B.S. in Computer Science"
                    className="rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Skills & Expertise
              </CardTitle>
              <CardDescription>Add skills to get better job matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add a skill (e.g. React)" 
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="rounded-xl"
                  />
                  <Button onClick={addSkill} variant="secondary" className="rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill: string) => (
                  <Badge 
                    key={skill} 
                    variant="secondary" 
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-2 border-none"
                  >
                    {skill}
                    {isEditing && (
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.skills.length === 0 && <p className="text-slate-400 text-sm italic">No skills added yet.</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Interests
              </CardTitle>
              <CardDescription>What fields are you interested in?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isEditing && (
                <div className="flex gap-2">
                  <Input 
                    placeholder="Add an interest (e.g. AI, Fintech)" 
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addInterest()}
                    className="rounded-xl"
                  />
                  <Button onClick={addInterest} variant="secondary" className="rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest: string) => (
                  <Badge 
                    key={interest} 
                    variant="secondary" 
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 flex items-center gap-2 border-none"
                  >
                    {interest}
                    {isEditing && (
                      <button onClick={() => removeInterest(interest)} className="hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.interests.length === 0 && <p className="text-slate-400 text-sm italic">No interests added yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
