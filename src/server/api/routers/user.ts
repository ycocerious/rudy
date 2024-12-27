import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUserDetails: publicProcedure.query(async ({ ctx }) => {
    console.log("🔥 Get user details was called");
    const user = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1);

    return user;
  }),
});
