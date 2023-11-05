"use client";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "./AccountMenu";
import { NavigationMenu } from "./NavigationMenu";

/* Specific paths that the app bar should not be shown on */
const hiddenPathnames: string[] = ["/logout", "/login", "/register"];

export const HomeControlAppBar = () => {
  // Don't show on certain pages
  const pathname = usePathname();

  return hiddenPathnames.includes(pathname) ? null : (
    <>
      <AppBar
        position="relative"
        color="primary"
        enableColorOnDark
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar variant="dense">
          <NavigationMenu />
          <Button component={Link} href="/" sx={{ marginRight: "auto" }}>
            <Typography
              variant="h6"
              color="primary.contrastText"
              textTransform="none"
            >
              HomeControl
            </Typography>
          </Button>
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};
