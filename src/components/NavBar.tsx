import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

const navigationPages = {
  Home: (
    <Link href="/">
      <div className="mr-4">Home</div>
    </Link>
  ),
  Report: (
    <Link href="/report">
      <div className="mr-4">Report</div>
    </Link>
  ),
  Split: <div className="mr-4">|</div>,
  Car: (
    <Link href="/car">
      <div className="mr-4">Car</div>
    </Link>
  ),
  User: (
    <Link href="/user">
      <div className="mr-4">User</div>
    </Link>
  ),
};

export const NavBar = () => {
  const { data: sessionData } = useSession();

  const { data: userRole, isLoading: loadingUserData } =
    api.user.getRole.useQuery(
      { userId: sessionData?.user.id ?? "1" },
      { enabled: !!sessionData },
    );

  if (sessionData) {
    return (
      <div className="flex w-full flex-row items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex flex-row items-center justify-start gap-4">
          {Object.values(navigationPages)}
        </div>
        <div className="flex flex-row items-center justify-end gap-4">
          <p className="text-white">
            User Role: {loadingUserData ? <>Loading...</> : <>{userRole}</>}
          </p>
          <Link href="/api/auth/signout">
            <div className="mr-4">Sign out</div>
          </Link>
        </div>
      </div>
    );
  } else {
    // sign in here
    return (
      <div className="flex w-full flex-row items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex flex-row items-center justify-end gap-4">
          <Link href="/api/auth/signin">
            <div className="mr-4">Sign in</div>
          </Link>
        </div>
      </div>
    );
  }
};
