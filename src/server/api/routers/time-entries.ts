import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const timeEntriesRouter = createTRPCRouter({
  timeEntryCreate: protectedProcedure
    .input(
      z.object({
        hours_worked: z.number().min(0).max(24),
        date: z.string(),
        projectId: z.string(),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.time_entry.upsert({
        where: {
          id: input.id,
        },
        update: {
          hours_worked: input.hours_worked,
        },
        create: {
          hours_worked: input.hours_worked,
          date: input.date,
          projectId: input.projectId,
        },
      });
    }),

  timeEntryDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.time_entry.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
