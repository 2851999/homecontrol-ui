"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchUser } from "../api/auth";
import { isLoggedIn } from "../authentication";
import { User } from "../api/schemas/auth";
import React from "react";

export const AuthenticationContext = React.createContext<
  User | null | undefined
>(null);

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
    // Check if logged in
    if (!isLoggedIn()) setUser(undefined);
    else {
      // TODO: Account for user being disabled (as they are by default)

      // Fetch and assign the user as logged in
      const getUser = async () => {
        setUser(await fetchUser());
      };
      getUser();
    }
  }, []);

  return (
    <AuthenticationContext.Provider value={user}>
      {props.children}
    </AuthenticationContext.Provider>
  );
};
