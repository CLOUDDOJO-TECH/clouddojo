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

// TODO: send an email to me with the feedback content and also populate a google sheet with the feedback progressively
export default function FeedbackDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-sm">
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-2xl w-[90vw] rounded-lg">
        <DialogHeader>
          <DialogTitle>Send us feedback</DialogTitle>
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
        <form className="space-y-5">
          <Textarea
            id="feedback"
            placeholder="How can we improve CloudDojo?"
            aria-label="Send feedback"
          />
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <Button className="bg-emerald-500">Send feedback</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}