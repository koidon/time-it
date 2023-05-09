import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const timesheetRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      take: 100,
      include: {
        time_entries: true,
      },
      where: {
        userId: ctx.auth.userId,
      },
    });
  }),

  projectCreate: protectedProcedure
    .input(z.object({ project: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: {
          project: input.project,
          userId: ctx.auth.userId,
        },
      });
    }),

  projectDelete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.deleteMany({
        where: {
          id: input.id,
        },
      });
    }),
});
