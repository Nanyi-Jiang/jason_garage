import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { UpdateModal } from "~/components/UpdateModal";
import { api } from "~/utils/api";

const attributesToCollect = [
  { name: "make", type: "text", placeholder: "Make" },
  { name: "model", type: "text", placeholder: "Model" },
  { name: "year", type: "number", placeholder: "Year" },
  { name: "vin", type: "text", placeholder: "VIN" },
  { name: "mileage", type: "number", placeholder: "Mileage" },
  { name: "color", type: "text", placeholder: "Color" },
];

const Index = () => {
  return (
    <div>
      <SinglePage />
    </div>
  );
};

const SinglePage = () => {
  // get the id from the url
  const router = useRouter();
  const { id } = router.query;
  const carId = Number(id);

  const {
    data: carData,
    isLoading,
    refetch,
  } = api.car.get.useQuery(
    { id: carId },
    {
      enabled: !!id,
    },
  );

  const deleteCarMutation = api.car.delete.useMutation();
  const updateCarFunction = api.car.update;

  // WIP
  const handleDelete = async () => {
    if (!id) return;
    await deleteCarMutation.mutateAsync({ id: carId });
    router.push("/car").catch(console.error);
  };

  return (
    <div>
      <div className=" font-bold">Car Record</div>
      <div className="font-bold">Car ID: {id}</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div>
            <div className="py-2">Make: {carData?.make}</div>
            <div className="py-2">Model: {carData?.model}</div>
            <div className="py-2">Year: {carData?.year}</div>
            <div className="py-2">VIN: {carData?.vin}</div>
            <div className="py-2">Mileage: {carData?.mileage}</div>
            <div className="py-2">Color: {carData?.color}</div>
          </div>

          <div className="py-2">
            <Button onClick={handleDelete}>Delete this Record</Button>
          </div>
          <div className="py-2">
            <UpdateModal
              tableName="Car"
              formInputs={attributesToCollect}
              submitFunction={updateCarFunction}
              refetch={refetch}
              id={carId}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
