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
        color: z.string(),
        mileage: z.number().optional(),
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

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.db.car.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.car.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
