import { SaveQuizAttempt } from "@/app/(actions)/quiz/attempts/save-quiz-attempt";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSaveQuizAttempt = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: SaveQuizAttempt,
    onError: (error) => {
      toast.error("Failed to save quiz attempt");
      console.error("Error saving quiz attempt:", error);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Quiz attempt saved successfully");
      } else {
        if (data.error?.includes("User not found in database")) {
          toast.error("Please complete your profile setup to save quiz results", {
            action: {
              label: "Setup Profile",
              onClick: () => router.push("/dashboard/profile"),
            },
          });
        } else {
          toast.error(data.error || "Failed to save quiz attempt");
        }
      }
    }
  });
};