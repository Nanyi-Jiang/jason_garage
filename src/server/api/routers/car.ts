import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const carRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        make: z.string(),
        model: z.string(),
        year: z.number(),
        vin: z.string(),
        mileage: z.number(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.car.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
        },
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
