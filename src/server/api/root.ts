import { createTRPCRouter } from "~/server/api/trpc";
import { timeEntriesRouter } from "./routers/time-entries";
import { timesheetRouter } from "~/server/api/routers/timesheets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  timeEntries: timeEntriesRouter,
  timesheet: timesheetRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
