import { useSession } from "next-auth/react";
import Link from "next/link";

const navigationPages = {
  Home: (
    <Link href="/">
      <div className="mr-4">Home</div>
    </Link>
  ),
  Car: (
    <Link href="/car">
      <div className="mr-4">Car</div>
    </Link>
  ),
};

export const NavBar = () => {
  const { data: sessionData } = useSession();

  if (sessionData) {
    return (
      <div className="flex w-full flex-row items-center justify-between bg-gray-800 px-4 py-2">
        <div className="flex flex-row items-center justify-start gap-4">
          {Object.values(navigationPages)}
        </div>
        <div className="flex flex-row items-center justify-end gap-4">
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
