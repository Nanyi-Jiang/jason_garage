import { db } from "../db";

// ====== Stored Functions ======
export async function getCarsReportByYear(startYear: number, endYear: number) {
  return db.$queryRaw`SELECT * FROM cars_report_within_year(${startYear}::integer, ${endYear}::integer)`;
}

export async function getCarsReportByMileage(
  lowerBound: number,
  upperBound: number,
) {
  return db.$queryRaw`SELECT * FROM cars_report_within_mileage(${lowerBound}::integer, ${upperBound}::integer)`;
}

// ====== Get All Stored Functions and Stored Procedures ======
export async function getAllStoredFunctionsAndProcedures() {
  const result =
    await db.$queryRaw`SELECT * FROM list_functions_and_procedures()`;
  return result;
}

// reference for stored function

// execute all CREATE stored functions
export async function executeAllStoredFunctions() {
  await db.$executeRaw`CREATE OR REPLACE FUNCTION cars_report_within_year(start_year INTEGER, end_year INTEGER)
  RETURNS SETOF "Car"
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY SELECT * FROM "Car" WHERE "year" >= start_year AND "year" < end_year;
  END;
  $$;`;

  await db.$executeRaw`CREATE OR REPLACE FUNCTION cars_report_within_mileage(lower_bound INTEGER, upper_bound INTEGER)
  RETURNS SETOF "Car"
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY SELECT * FROM "Car" WHERE "mileage" >= lower_bound AND "mileage" < upper_bound;
  END;
  $$;`;

  await db.$executeRaw`CREATE OR REPLACE FUNCTION list_functions_and_procedures()
  RETURNS TABLE("Schema" text, "Name" text, "ResultDataType" text, "ArgumentDataTypes" text)
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY
    SELECT n.nspname::text as "Schema",
           p.proname::text as "Name",
           pg_catalog.pg_get_function_result(p.oid)::text as "ResultDataType",
           pg_catalog.pg_get_function_arguments(p.oid)::text as "ArgumentDataTypes"
    FROM pg_catalog.pg_proc p
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE pg_catalog.pg_function_is_visible(p.oid)
      AND n.nspname = 'public'
    ORDER BY 1, 2;
  END;
  $$;`;
}
