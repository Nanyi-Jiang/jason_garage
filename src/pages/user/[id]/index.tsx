import { Button, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";

const userRoleOptions = [
  { value: "USER", label: "USER" },
  { value: "ADMIN", label: "ADMIN" },
];

type UserRole = "USER" | "ADMIN";

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
  const userId = id as string;

  const [openForm, setOpenForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const { data: userData, isLoading } = api.user.get.useQuery(
    { id: userId },
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (userData) {
      setSelectedRole(userData.role);
    }
  }, [userData]);

  const deleteUserMutation = api.user.delete.useMutation();
  const updateUserMutation = api.user.update.useMutation();

  // WIP
  // TODO: implement transaction for deleting the user
  const handleDelete = async () => {
    if (!id) return;
    await deleteUserMutation.mutateAsync({ id: userId });
    router.push("/user").catch(console.error);
  };

  // TODO: only make the role updatable
  const handleUpdate = () => {
    setOpenForm(true);
  };

  const handleUserRoleChangeDisplay = (e: any) => {
    setSelectedRole(e.target.value as UserRole);
  };
  return (
    <div className="flex flex-col">
      <div className=" font-bold">User Record</div>
      <div className="font-bold">User ID: {userId}</div>
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
            <Button onClick={handleUpdate}>Update this Record</Button>
          </div>
          <div className={`${openForm ? "" : "hidden"}`}>
            {/* only make the user role (enum with USER or ADMIN) updatable */}
            <form
              onSubmit={(e) => {
                setOpenForm(false);
                e.preventDefault();
                updateUserMutation.mutate({
                  id: userId,
                  role: selectedRole!,
                });
                // refresh the page
                window.location.reload();
              }}
            >
              <label htmlFor="role">Role: </label>
              <Select
                placeholder="Select Role"
                name="role"
                value={selectedRole ?? "USER"}
                onChange={handleUserRoleChangeDisplay}
              >
                {userRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
