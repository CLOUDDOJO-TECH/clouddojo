import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { toast } from "sonner";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {user, isSignedIn, isLoaded } = useUser();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedMood) newErrors.mood = "Please select how you're feeling";
    if (!feedbackType) newErrors.type = "Please select a feedback type";
    if (!feedbackContent.trim()) newErrors.content = "Please enter your feedback";
    else if (feedbackContent.trim().length < 10) newErrors.content = "Feedback must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn || !isLoaded || !user) {
      toast.error("You must be logged in to submit feedback");
      return;
    }

    if (!validate()) return;

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

      // Reset form and close dialog
      setFeedbackType("");
      setFeedbackContent("");
      setSelectedMood("");
      setErrors({});
      onOpenChange?.(false);

      // Show toast after dialog closes
      setTimeout(() => {
        toast.success(`Thank you ${user.fullName}! We really appreciate your feedback.`);
      }, 150);
    } catch (error) {
      toast.error("Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <div>
        <Button size="sm" className="group md:flex hidden text-sm rounded-lg text-primary-foreground overflow-hidden relative">
          <MessagesSquare className="h-5 left-3 w-5 text-primary-foreground mr-1.5 absolute group-hover:translate-y-10 transition-all duration-300" />
          <MessagesSquare className="h-5 w-5 left-3 text-primary-foreground mr-1.5 absolute -translate-y-10 group-hover:translate-y-0 transition-all duration-300" />
          <span className="ml-6">Feedback</span>
        </Button>
        <Button variant="outline" size="sm" className="text-sm md:hidden shadow-none hover:bg-gray-300 dark:hover:bg-gray-100/20 block rounded-sm md:border-emerald-500/30 border-none text-primary">
          <MessagesSquare className="h-5 w-5 text-primary"/>
        </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg w-[92vw] rounded-lg border-dashed p-0 overflow-hidden gap-0">
        <div className="p-6 pb-4">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl font-bold">Send us feedback</DialogTitle>
        </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 px-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">How are you feeling?</label>
            <div className="flex flex-wrap gap-2">
              {moodEmojis.map(({ emoji, label }) => (
                <Button
                  key={emoji}
                  type="button"
                  variant="outline"
                  className={`h-8 px-2.5 border-dashed transition-colors hover:bg-muted ${
                    selectedMood === emoji ? "bg-primary text-primary-foreground border-primary border-solid" : ""
                  }`}
                  onClick={() => {
                    setSelectedMood(emoji);
                    setErrors((prev) => ({ ...prev, mood: "" }));
                  }}
                >
                  <span className="text-base mr-1.5">{emoji}</span>
                  <span className="text-xs">{label}</span>
                </Button>
              ))}
            </div>
            {errors.mood && <p className="text-xs text-destructive/70">{errors.mood}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="feedbackType" className="text-sm font-medium">
              Feedback Type
            </label>
            <Select
              value={feedbackType}
              onValueChange={(val) => {
                setFeedbackType(val);
                setErrors((prev) => ({ ...prev, type: "" }));
              }}
            >
              <SelectTrigger className={errors.type ? "border-destructive/50" : ""}>
                <SelectValue placeholder="Select feedback type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bug">Bug Report</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <p className="text-xs text-destructive/70">{errors.type}</p>}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="feedback" className="text-sm font-medium">
              Your Feedback
            </label>
            <Textarea
              id="feedback"
              value={feedbackContent}
              onChange={(e) => {
                setFeedbackContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              placeholder="How can we improve CloudDojo?"
              className={`min-h-[80px] ${errors.content ? "border-destructive/50" : ""}`}
            />
            {errors.content && <p className="text-xs text-destructive/70">{errors.content}</p>}
          </div>
          <div className="bg-muted/50 border-t border-dashed -mx-6 mt-2 px-6 py-4 flex justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-lg border-dashed hover:bg-background transition-colors"
              onClick={() => onOpenChange?.(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-lg flex-1 active:scale-[0.97] transition-transform"
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