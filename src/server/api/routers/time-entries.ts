import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const timeEntriesRouter = createTRPCRouter({
  timeEntryCreate: protectedProcedure
    .input(
      z.object({
        hours_worked: z.number(),
        date: z.string(),
        projectId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.time_entry.create({
        data: {
          hours_worked: input.hours_worked,
          date: input.date,
          projectId: input.projectId,
        },
      });
    }),
});
