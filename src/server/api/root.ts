import { createTRPCRouter } from "src/server/api/trpc";
import { pageRouter } from "./routers/page";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  page: pageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
