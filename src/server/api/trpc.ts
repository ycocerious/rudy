import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { createClient } from "@/utils/supabase/server";

//create context -  great place to put things like db and auth info
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Throw error if no user (this is a backup since middleware should prevent this)
  if (!user) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "User not found in database",
    });
  }

  return {
    db,
    userId: user.id,
    ...opts,
  };
};

//trpc API initialisation
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
