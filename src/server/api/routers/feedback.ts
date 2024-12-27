import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { feedbacks } from "@/server/db/schema";
import { z } from "zod";

export const feedbackRouter = createTRPCRouter({
  submitFeedback: publicProcedure
    .input(
      z.object({
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newFeedback] = await ctx.db
        .insert(feedbacks)
        .values({
          userId: ctx.userId,
          rating: input.rating,
          feedback: input.feedback ?? null,
        })
        .returning();

      return newFeedback;
    }),
});
