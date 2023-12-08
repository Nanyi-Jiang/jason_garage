import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  createCar,
  getAllCars,
  getCarById,
  getCarsByUserId,
  deleteCarById,
  updateCar,
} from "../car";
import {
  getCarsReportByYear,
  getCarsReportByMileage,
} from "../storedProcedures";

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

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        make: z.string().optional(),
        model: z.string().optional(),
        year: z.number().optional(),
        vin: z.string().optional(),
        color: z.string().optional(),
        mileage: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const car = await getCarById(input.id);
      if (!car) {
        throw new Error("Car not found");
      }
      return updateCar(input);
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      return deleteCarById(input.id);
    }),

  getAllById: protectedProcedure.query(({ ctx }) => {
    return getCarsByUserId(ctx.session.user.id);
  }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return getAllCars(ctx.session.user.id);
  }),

  getCarsReportByYear: protectedProcedure
    .input(
      z.object({
        yearLeft: z.number(),
        yearRight: z.number(),
      }),
    )
    .query(({ input }) => {
      return getCarsReportByYear(input.yearLeft, input.yearRight);
    }),
  getCarsReportByMileage: protectedProcedure
    .input(
      z.object({
        mileageLeft: z.number(),
        mileageRight: z.number(),
      }),
    )
    .query(({ input }) => {
      return getCarsReportByMileage(input.mileageLeft, input.mileageRight);
    }),
});
