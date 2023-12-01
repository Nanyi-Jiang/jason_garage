import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  getUserRole,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
} from "~/server/api/user";

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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      return deleteUserById(input.id);
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().optional(),
        name: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
      }),
    )
    .mutation(({ input }) => {
      return updateUser(input);
    }),
});
