"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUser } from "../api/auth";
import { LoadingPage } from "./LoadingPage";
import { isLoggedIn } from "../authentication";
import { User } from "../api/schemas/auth";

/**
 * Component to wrap around anything that should require an authenticated user
 *
 * Will redirect to the login page if the user isn't logged in
 *
 * @param props
 * @returns
 */
export const Authenticated = (props: { children: any }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if logged in
    if (!isLoggedIn()) router.push("/login");
    else {
      // Fetch and assign the user as logged in
      const getUser = async () => {
        setUser(await fetchUser());
      };
      getUser();
    }
  }, []);

  // Load until the user is obtained
  return user === null ? <LoadingPage /> : <>{props.children}</>;
};
