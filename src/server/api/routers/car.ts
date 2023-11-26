import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getUserRole } from "../user";
import { createCar, getAllCars, getCarById, getCarsByUserId } from "../car";

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
      return createCar(input, ctx.session.user.id);
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return getCarById(input.id);
    }),

  getAllById: protectedProcedure.query(({ ctx }) => {
    return getCarsByUserId(ctx.session.user.id);
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return getAllCars(ctx.session.user.id);
  }),
});
