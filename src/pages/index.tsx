import { useSession } from "next-auth/react";

import { api } from "~/utils/api";

export default function Home() {
  const hello = api.post.hello.useQuery({ text: "from Nanyi's Garage" });

  return (
    <>
      <main>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();
  const { data: userRole, isLoading: loadingUserData } =
    api.user.getRole.useQuery(
      { userId: sessionData?.user.id ?? "1" },
      { enabled: !!sessionData?.user?.id },
    );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        <p>User Role: {loadingUserData ? <>Loading...</> : <>{userRole}</>}</p>
      </div>
      <p>
        {!sessionData && (
          <>Feel free to checkout the pages in the navbar after sign in.</>
        )}
      </p>
    </div>
  );
}
