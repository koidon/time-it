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
        week: z.string(),
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
          week: input.week,
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
  workSegmentDeleteAll: protectedProcedure
    .input(
      z.object({
        week: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.workSegment.deleteMany({
        where: {
          week: input.week,
        },
      });
    }),

  workSegmentDeleteRow: protectedProcedure
    .input(
      z.object({
        timeSheetSegmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.workSegment.deleteMany({
        where: {
          timeSheetSegmentId: input.timeSheetSegmentId,
        },
      });
    }),
});
