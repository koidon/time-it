import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const timeSheetSegmentRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.timeSheetSegment.findMany({
      include: {
        workSegments: true,
      },
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),

  timeSheetSegmentCreate: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        currentWeek: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.timeSheetSegment.create({
        data: {
          projectName: input.projectName,
          userId: ctx.auth.userId,
          currentWeek: input.currentWeek,
        },
      });
    }),

  timeSheetSegmentDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.timeSheetSegment.delete({
        where: {
          id: input.id,
        },
      });
    }),
  timeSheetSegmentDeleteAll: protectedProcedure
    .input(
      z.object({
        currentWeek: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.timeSheetSegment.deleteMany({
        where: {
          currentWeek: input.currentWeek,
        },
      });
    }),
});
