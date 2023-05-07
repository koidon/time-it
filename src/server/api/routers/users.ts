import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/api";

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({}) => {
    return await clerkClient.users.getUserList();
  }),
});
