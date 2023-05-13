import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const workSegmentRouter = createTRPCRouter({
  workSegmentCreate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        timeSheetSegmentId: z.string(),
        hoursWorked: z.number().min(0).max(24),
        date: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.workSegment.upsert({
        where: {
          id: input.id,
        },
        update: {
          hoursWorked: input.hoursWorked,
        },
        create: {
          timeSheetSegmentId: input.timeSheetSegmentId,
          userId: ctx.auth.userId,
          hoursWorked: input.hoursWorked,
          date: input.date,
        },
      });
    }),

  workSegmentDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.workSegment.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
