"use client";

import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { UserAccountType } from "../api/schemas/auth";
import { AuthenticationContext } from "./AuthenticationProvider";
import { LoadingPage } from "./LoadingPage";

/**
 * @param adminOnly: Whether the page should only be accessible to admin
 *                   accounts (when undefined assumes a value of false)
 */
export interface AuthenticatedProps {
  adminOnly?: boolean;
  children: any;
}

/**
 * Component to wrap around anything that should require an authenticated user
 *
 * Will redirect to the login page if the user isn't logged in
 *
 * @param props
 * @returns
 */
export const Authenticated = (props: AuthenticatedProps) => {
  const router = useRouter();
  const [user] = useContext(AuthenticationContext);

  // Memo doesn't wait for render so should stop flicker
  useEffect(() => {
    // Redirect to login if needed
    if (user === undefined) router.push("/login");
  }, [user]);

  // Load until the user is obtained
  // Also ensure the user has the required access level
  return user === undefined || user === null ? (
    <LoadingPage />
  ) : user !== undefined &&
    props.adminOnly &&
    user.account_type !== UserAccountType.ADMIN ? (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item>
        <Typography variant="h1">Admin only</Typography>
      </Grid>
    </Grid>
  ) : (
    props.children
  );
};

/**
 * HOC for wrapping a component in Authenticated
 *
 * @param ComponentToWrap - Component to render as a child of of Authenticated
 * @param authProps - Props to pass to Authenticated
 * @returns
 */
export const withAuth = <P,>(
  ComponentToWrap: React.ComponentType<P>,
  authProps?: AuthenticatedProps
) => {
  const WrappedComponent = (children: any, ...props: any[]) => {
    return (
      <Authenticated {...authProps}>
        <ComponentToWrap {...(props as P)}>{children}</ComponentToWrap>
      </Authenticated>
    );
  };
  return WrappedComponent;
};
