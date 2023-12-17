"use client";

import React, { useEffect, useState } from "react";
import { fetchUser } from "../api/auth";
import { User } from "../api/schemas/auth";
import { isLoggedIn } from "../authentication";

export const AuthenticationContext = React.createContext<
  [
    User | null | undefined,
    React.Dispatch<React.SetStateAction<User | null | undefined>> | null
  ]
>([null, null]);

/**
 * Component that obtains the current user and authenticates it
 *
 * @param props
 * @returns
 */
export const AuthenticationProvider = (props: { children: any }) => {
  // null - not loaded, undefined - not logged in
  const [user, setUser] = useState<User | null | undefined>(null);

  useEffect(() => {
    // Check if should load the user
    if (!isLoggedIn()) setUser(undefined);
    else if (user === null || user === undefined) {
      // Fetch and assign the user as logged in
      const getUser = async () => {
        setUser(await fetchUser());
      };
      getUser();
    }
  }, [user]);

  return (
    <AuthenticationContext.Provider value={[user, setUser]}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
