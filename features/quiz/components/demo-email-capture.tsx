"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Sparkles, Lock } from "lucide-react";
import { toast } from "sonner";

interface DemoEmailCaptureProps {
  isOpen: boolean;
  onEmailSubmit: (email: string) => void;
  score: number;
  totalQuestions: number;
}

export function DemoEmailCapture({
  isOpen,
  onEmailSubmit,
  score,
  totalQuestions,
}: DemoEmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/demo/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          score,
          totalQuestions,
          percentage: Math.round((score / totalQuestions) * 100),
        }),
      });

      if (!response.ok) throw new Error("Failed to save email");

      toast.success("Results unlocked! Check your email for details.");
      onEmailSubmit(email);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideClose>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-emerald-500/10 p-3">
              <Sparkles className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Unlock Your Full Results
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview of locked content */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>See what's unlocked:</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Detailed performance breakdown</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Topic-by-topic analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Personalized study recommendations</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>How you compare to others</span>
              </li>
            </ul>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
                disabled={isSubmitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Unlocking..." : "Get My Full Results"}
            </Button>
          </form>

          <p className="text-xs text-center text-muted-foreground">
            We'll email your results + send tips to help you pass your certification. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
