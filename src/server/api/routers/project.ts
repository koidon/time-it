import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      select: {
        id: true,
        projectName: true,
        employees: {
          where: {
            userId: ctx.auth.userId,
          },
        },
      },
    });
  }),
});
