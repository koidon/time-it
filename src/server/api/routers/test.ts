import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/api";
import type { User } from "@clerk/backend";
import { z } from "zod";

const filterUserForClient = (user: User) => {
  return { id: user.id, username: user.username };
};

export const testRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      take: 100,
      include: {
        time_entries: true,
      },
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: projects.map((project) => project.userId),
        limit: 100,
      })
    ).map(filterUserForClient);

    console.log(users);

    return projects.map((project) => ({
      project,
      user: users.find((user) => user.id === project.userId),
    }));
  }),
});
