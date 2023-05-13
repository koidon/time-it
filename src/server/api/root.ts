import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/users";
import { projectRouter } from "~/server/api/routers/project";
import { timeSheetSegmentRouter } from "~/server/api/routers/timeSheetSegments";
import { workSegmentRouter } from "~/server/api/routers/workSegment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  users: userRouter,
  project: projectRouter,
  timeSheetSegment: timeSheetSegmentRouter,
  workSegmentRouter: workSegmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
