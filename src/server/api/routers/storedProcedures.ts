import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getAllStoredFunctionsAndProcedures } from "../storedProcedures";

export const storedProceduresRouter = createTRPCRouter({
  getAll: protectedProcedure.query(() => {
    return getAllStoredFunctionsAndProcedures();
  }),
});
