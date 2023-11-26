import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserRole } from "~/server/api/user";

export const userRouter = createTRPCRouter({
  getRole: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return getUserRole(input.userId);
    }),
});
