import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

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

  const { data: userData, isLoading } = api.user.get.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    },
  );

  const deleteUserMutation = api.user.delete.useMutation();

  // WIP
  // TODO: implement transaction for deleting the user
  const handleDelete = async () => {
    if (!id) return;
    await deleteUserMutation.mutateAsync({ id: id as string });
    router.push("/user").catch(console.error);
  };

  // TODO: only make the role updatable
  // const handleUpdate = () => {
  //   api.car.update.useMutation({ id: Number(id) });
  // }
  return (
    <div>
      <div className=" font-bold">User Record</div>
      <div className="font-bold">User ID: {id}</div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="py-2">email: {userData?.email}</div>
          <div className="py-2">name: {userData?.name}</div>
          <div className="py-2">role: {userData?.role}</div>
          <div className="py-2">
            <Button onClick={handleDelete}>Delete this Record</Button>
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
