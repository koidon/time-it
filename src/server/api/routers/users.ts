import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/api";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({}) => {
    return await clerkClient.users.getUserList();
  }),
  getAccessToken: protectedProcedure.query(async ({ ctx }) => {
    return await clerkClient.users.getUserOauthAccessToken(
      ctx.auth.userId,
      "oauth_microsoft"
    );
  }),
  updateUserRole: protectedProcedure
    .input(
      z.object({
        isProjectLeader: z.boolean(),
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = input.userId;
      const isProjectLeader = {
        publicMetadata: { isProjectLeader: input.isProjectLeader },
      };
      return await clerkClient.users.updateUser(userId, isProjectLeader);
    }),
});
