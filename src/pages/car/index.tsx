import React from "react";
import { CreateModal } from "~/components/CreateModal";
import { SQLTable } from "~/components/SQLTable";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
// import trpc schema for car.getAll route
import { inferProcedureOutput } from "@trpc/server";

const Index = () => {
  const { data: sessionData } = useSession();

  return sessionData ? (
    <div>
      <CarPage />
    </div>
  ) : (
    <div>Sign in to view this page</div>
  );
};

const CarPage = () => {
  const attributesToCollect = [
    { name: "make", type: "text", placeholder: "Make" },
    { name: "model", type: "text", placeholder: "Model" },
    { name: "year", type: "number", placeholder: "Year" },
    { name: "vin", type: "text", placeholder: "VIN" },
    { name: "mileage", type: "number", placeholder: "Mileage" },
    { name: "color", type: "text", placeholder: "Color" },
  ];
  const [rows, setRows] = useState<any[]>([]);
  const columnsToDisplay = [
    "id",
    "make",
    "model",
    "year",
    "vin",
    "mileage",
    "createdAt",
  ];

  const submitFunction = api.car.create;
  const { isLoading, data: cars, refetch } = api.car.getAll.useQuery();

  useEffect(() => {
    if (cars) {
      // need to place rows into an array
      const rows = [];
      for (const car of cars) {
        rows.push(car);
      }
      setRows(rows);
    }
  }, [cars]);

  return (
    <div className="flex flex-col">
      {/* Head to show which table this page is */}
      <div className=" font-bold">Car Table</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SQLTable data={rows} columns={columnsToDisplay} />
      )}
      <CreateModal
        tableName="Car"
        formInputs={attributesToCollect}
        submitFunction={submitFunction}
        refetch={refetch}
      />
    </div>
  );
};

export default Index;
