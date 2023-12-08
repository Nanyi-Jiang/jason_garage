import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { carRouter } from "./routers/car";
import { userRouter } from "./routers/user";
import { storedProceduresRouter } from "./routers/storedProcedures";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  car: carRouter,
  user: userRouter,
  storedProcedure: storedProceduresRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
