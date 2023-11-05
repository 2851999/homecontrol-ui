"use client";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AuthenticatedComponent } from "./Authenticated";
import { AccountMenu } from "./AccountMenu";

/* Specific paths that the app bar should not be shown on */
const hiddenPathnames: string[] = ["/logout", "/login", "/register"];

interface Route {
  // Text to display in the menu
  text: string;
  // Path to link to when clicked
  path: string;
}

/* Specific admin routes to have navigation for */
const ADMIN_ROUTES: Route[] = [{ text: "Users", path: "/admin/users" }];

export const HomeControlAppBar = () => {
  // State of the navigation drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

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
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </IconButton>
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
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          marginTop={7}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <AuthenticatedComponent adminOnly>
            <Typography variant="h5" px={2}>
              Admin
            </Typography>
            <List disablePadding>
              {ADMIN_ROUTES.map((route: Route) => (
                <ListItem
                  key={route.path}
                  component={Link}
                  href={route.path}
                  disablePadding
                >
                  <ListItemButton dense>
                    <ListItemText
                      primary={route.text}
                      primaryTypographyProps={{ color: "text.secondary" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </AuthenticatedComponent>
        </Box>
      </SwipeableDrawer>
    </>
  );
};
