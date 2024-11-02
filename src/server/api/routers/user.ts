import { users } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq } from "drizzle-orm";

export const userRouter = createTRPCRouter({
  getUserDetails: publicProcedure.query(async ({ ctx }) => {
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1);

    return user;
  }),
});
