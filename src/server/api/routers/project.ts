import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const projectRouter = createTRPCRouter({
  getCreatedProjects: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany({
      where: {
        creator: ctx.auth.userId,
      },
    });
  }),

  getAssignedProjects: protectedProcedure.query(async ({ ctx }) => {
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

  projectCreate: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        employees: z.array(
          z.object({
            userId: z.string(),
          })
        ),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: {
          projectName: input.projectName,
          creator: ctx.auth.userId,
          employees: {
            create: input.employees,
          },
        },
      });
    }),

  projectDelete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
