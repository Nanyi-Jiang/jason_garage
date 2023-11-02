import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const Index = () => {
  return (
    <div>
      <SingleCarPage />
    </div>
  );
};

const SingleCarPage = () => {
  // get the id from the url
  const router = useRouter();
  const { id } = router.query;

  // make id a number

  const { data: carData, isLoading } = api.car.get.useQuery(
    { id: Number(id) },
    {
      enabled: !!id,
    },
  );

  // WIP
  // const handleDelete = () => {
  //   api.car.delete.useMutation({ id: Number(id) });
  // }

  // const handleUpdate = () => {
  //   api.car.update.useMutation({ id: Number(id) });
  // }
  return (
    <div>
      <div className=" font-bold">Car Record</div>
      <div className="font-bold">Car ID: {id}</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="py-2">Make: {carData?.make}</div>
          <div className="py-2">Model: {carData?.model}</div>
          <div className="py-2">Year: {carData?.year}</div>
          <div className="py-2">VIN: {carData?.vin}</div>
          <div className="py-2">Mileage: {carData?.mileage}</div>
          <div className="py-2">Color: {carData?.color}</div>
          <div className="py-2">
            <Button>Delete this Record</Button>
          </div>
          <div className="py-2">
            <Button>Update this Record</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
