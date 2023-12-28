"use client";

import { Grid, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { UserAccountType } from "../api/schemas/auth";
import { AuthenticationContext } from "./AuthenticationProvider";
import { LoadingPage } from "./LoadingPage";
import { isAppBarHidden } from "./HomeControlAppBar";

/**
 * @param adminOnly: Whether the page should only be accessible to admin
 *                   accounts (when undefined assumes a value of false)
 */
export interface AuthenticatedProps {
  adminOnly?: boolean;
  children: any;
}

/**
 * Component to wrap around a page that should require an authenticated user
 *
 * Will redirect to the login page if the user isn't logged in
 *
 * @param props
 * @returns
 */
export const AuthenticatedPage = (props: AuthenticatedProps) => {
  const router = useRouter();
  const [user] = useContext(AuthenticationContext);

  const pathname = usePathname();
  const minHeight = isAppBarHidden(pathname) ? "100vh" : "calc(100vh - 48px)";

  useEffect(() => {
    // Redirect to login if needed
    if (user === undefined) router.push("/login");
  }, [router, user]);

  // Load until the user is obtained
  // Also ensure the user has the required access level
  return user === undefined || user === null ? (
    <LoadingPage height={minHeight} />
  ) : user !== undefined &&
    props.adminOnly &&
    user.account_type !== UserAccountType.ADMIN ? (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: minHeight }}
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
 * Component to wrap around a component that should only be seen by an authenticated user
 *
 * @param props
 * @returns
 */
export const AuthenticatedComponent = (props: AuthenticatedProps) => {
  const [user] = useContext(AuthenticationContext);

  return !user ||
    (props.adminOnly && user.account_type !== UserAccountType.ADMIN)
    ? null
    : props.children;
};

/**
 * HOC for wrapping a component in AuthenticatedPage
 *
 * @param ComponentToWrap - Component to render as a child of of AuthenticatedPage
 * @param authProps - Props to pass to AuthenticatedPage
 * @returns
 */
export const withAuth = <P,>(
  ComponentToWrap: React.ComponentType<P>,
  authProps?: AuthenticatedProps
) => {
  const WrappedComponent = (children: any, ...props: any[]) => {
    return (
      <AuthenticatedPage {...authProps}>
        <ComponentToWrap {...(props as P)}>{children}</ComponentToWrap>
      </AuthenticatedPage>
    );
  };
  return WrappedComponent;
};
