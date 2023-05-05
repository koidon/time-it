import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { User } from "@clerk/backend";
import { clerkClient } from "@clerk/nextjs/api";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
  };
};

export const timesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const times = await ctx.prisma.time_entries.findMany({
      take: 100,
    });

    const users = (
      await clerkClient.users.getUserList({
        userId: times.map((time) => time.userId),
        limit: 100,
      })
    ).map(filterUserForClient);
  }),
});
