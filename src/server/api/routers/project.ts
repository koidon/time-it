import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      where: {
        employees: {
          some: {
            userId: ctx.auth.userId,
          },
        },
      },
    });
  }),
});
