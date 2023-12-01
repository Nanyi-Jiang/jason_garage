import React from "react";
import { SQLTable } from "~/components/SQLTable";
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Index = () => {
  const { data: sessionData } = useSession();
  const { data: userRole, isLoading: loadingUserData } =
    api.user.getRole.useQuery(
      { userId: sessionData?.user.id ?? "1" },
      { enabled: !!sessionData?.user?.id },
    );

  return sessionData && !loadingUserData && userRole === "ADMIN" ? (
    <div>
      <UserPage />
    </div>
  ) : (
    <div>Only Sign in with ADMIN role can view this page</div>
  );
};

const UserPage = () => {
  const [rows, setRows] = useState<any[]>([]);
  const columnsToDisplay = ["id", "email", "name", "role"];

  const { isLoading, data: users } = api.user.getAll.useQuery();

  useEffect(() => {
    if (users) {
      // need to place rows into an array
      const rows = [];
      for (const car of users) {
        rows.push(car);
      }
      setRows(rows);
    }
  }, [users]);

  return (
    <div className="flex flex-col">
      {/* Head to show which table this page is */}
      <header className=" font-bold">User Table</header>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SQLTable data={rows} columns={columnsToDisplay} table="user" />
      )}
    </div>
  );
};

export default Index;
