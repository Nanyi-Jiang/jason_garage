import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserRole, getAllUsers, getUserById } from "~/server/api/user";

export const userRouter = createTRPCRouter({
  getRole: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getUserRole(input.userId);
    }),

  getAll: protectedProcedure.query(() => {
    return getAllUsers();
  }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return getUserById(input.id);
    }),
});
