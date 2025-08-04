import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { sendFeedbackEmails } from "@/lib/emails/send-email";
import { useUser } from "@clerk/nextjs";
import { MessagesSquare } from "lucide-react";

interface FeedbackDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const moodEmojis = [
  { emoji: "😊", label: "Happy" },
  { emoji: "🤔", label: "Confused" },
  { emoji: "😕", label: "Concerned" },
  { emoji: "😡", label: "Frustrated" },
  { emoji: "🎉", label: "Excited" },
  { emoji: "👍", label: "Satisfied" },
  { emoji: "🐛", label: "Found a bug" },
  { emoji: "💡", label: "Have an idea" },
];

// TODO: populate a google sheet with the feedback progressively
export default function FeedbackDialog({ open, onOpenChange }: FeedbackDialogProps) {
  const [loading, setLoading] = useState(false);
  const [feedbackType, setFeedbackType] = useState<string>("");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const { toast } = useToast();
  const {user, isSignedIn, isLoaded } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !isLoaded || !user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit feedback",
        variant: "destructive",
      });
      return;
    }

    if (!feedbackType || !feedbackContent.trim() || !selectedMood) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await sendFeedbackEmails({
        userEmail: user.emailAddresses[0].emailAddress,
        userName: user.fullName || "",
        feedbackType,
        feedbackContent,
        mood: selectedMood,
      });

      if (!result.success) throw new Error("Failed to send feedback");

      toast({
        title: `💃 Thank You ${user.fullName}`,
        description: "We really appreciate your feedback, and our experts will take a look at it 💚",
      });
      
      // Reset form and close dialog
      setFeedbackType("");
      setFeedbackContent("");
      setSelectedMood("");
      onOpenChange?.(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div>
        <Button size="sm" className="group md:flex hidden text-sm rounded-lg text-foreground-primary overflow-hidden relative">
          <MessagesSquare className="h-5 left-3 w-5 text-foreground-primary mr-1.5 absolute group-hover:translate-y-10 transition-all duration-300" />
          <MessagesSquare className="h-5 w-5 left-3 text-foreground-primary mr-1.5 absolute -translate-y-10 group-hover:translate-y-0 transition-all duration-300" />
          <span className="ml-6">Feedback</span>
        </Button>
        <Button variant="outline" size="sm" className="text-sm md:hidden shadow-none hover:bg-gray-300 dark:hover:bg-gray-100/20 block rounded-sm md:border-emerald-500/30 border-none text-primary">
          <MessagesSquare className="h-5 w-5 text-primary"/>
        </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl">Send us feedback</DialogTitle>
          <DialogDescription>
            Watch{" "}
            <a className="text-foreground hover:underline" href="#">
              tutorials
            </a>
            , read CloudDojo&lsquo;s{" "}
            <a className="text-foreground hover:underline" href="#">
              documentation
            </a>
            , or join our{" "}
            <a className="text-foreground hover:underline" href="#">
              Discord
            </a>{" "}
            for community help.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {moodEmojis.map(({ emoji, label }) => (
                <Button
                  key={emoji}
                  type="button"
                  variant="outline"
                  className={`h-10 px-3 py-2 hover:bg-emerald-50 ${
                    selectedMood === emoji ? "bg-emerald-50 border-emerald-500" : ""
                  }`}
                  onClick={() => setSelectedMood(emoji)}
                >
                  <span className="text-lg mr-2">{emoji}</span>
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedbackType" className="text-sm font-medium">
              Feedback Type
            </label>
            <Select
              value={feedbackType}
              onValueChange={setFeedbackType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="feedback" className="text-sm font-medium">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedbackContent}
              onChange={(e) => setFeedbackContent(e.target.value)}
              placeholder="How can we improve CloudDojo?"
              className="min-h-[100px]"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg text-primary"
              onClick={() => onOpenChange?.(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-emerald-500 rounded-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send feedback"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}