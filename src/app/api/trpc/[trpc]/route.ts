import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "@/env";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = async (req: NextRequest) => {
  // Get the pathname to check which procedure is being called
  const pathname = new URL(req.url).pathname;
  const procedurePath = pathname.replace("/api/trpc/", "");

  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
            );
          }
        : undefined,
  });

  // Add Cache-Control headers based on the procedure
  if (procedurePath.startsWith("task.getTodaysTasks")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, must-revalidate=true, stale-while-revalidate=3600",
    );
    response.headers.set("Surrogate-Control", "public, max-age=86400");
    response.headers.set("Vary", "Accept-Encoding");
  } else {
    // Default caching for other routes
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=30",
    );
  }

  return response;
};

export { handler as GET, handler as POST };
