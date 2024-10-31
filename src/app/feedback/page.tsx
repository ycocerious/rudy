"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarIcon } from "lucide-react";

export default function LeaveFeedback() {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");

  const handleFeedbackChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the feedback to your server
    console.log({ rating, feedback });
    // Reset form after submission
    setRating(0);
    setFeedback("");
    alert("Thank you for your feedback!");
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 text-foreground">
      <h1 className="mb-8 w-[80%] text-center text-2xl font-bold text-primary">
        Leave a Feedback
      </h1>
      <form onSubmit={handleSubmit} className="w-[80%] space-y-6">
        <div className="flex flex-col items-center justify-center">
          <label className="mb-2 block text-sm font-medium">
            How would you rate your experience?
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
            placeholder="Tell me about your experience..."
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
            disabled={rating === 0}
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
