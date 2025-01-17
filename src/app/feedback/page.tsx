"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/trpc/react";
import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import toast from "react-hot-toast";

export default function LeaveFeedback() {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const { mutateAsync: submitFeedback, isPending } =
    api.feedback.submitFeedback.useMutation({
      onSuccess: () => {
        toast.success("Thank you for your feedback!");
        router.push("/");
      },
      onError: () => {
        toast.error("Failed to submit feedback. Please try again.");
      },
    });

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitFeedback({
      rating,
      feedback: feedback.trim() || undefined,
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-foreground">
      <h1 className="mb-8 w-[80%] text-center text-2xl font-bold text-primary">
        Leave a Feedback
      </h1>
      <form onSubmit={handleSubmit} className="w-[80%] space-y-6">
        <div className="flex flex-col items-center justify-center">
          <label className="mb-2 block text-sm font-medium">
            How&apos;d you like Rudy? 🙆‍♀️
          </label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`rounded-full p-1 transition-colors ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                <StarIcon className="h-8 w-8" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Textarea
            id="feedback"
            placeholder="Tell us about it!"
            value={feedback}
            onChange={handleFeedbackChange}
            className="w-full border-border bg-card text-card-foreground"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-center">
          <Button
            type="submit"
            className="w-[50%] bg-primary text-primary-foreground hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            disabled={rating === 0 || isPending}
          >
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
