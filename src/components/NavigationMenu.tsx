"use client";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";
import { AuthenticatedComponent } from "./Authenticated";

interface Route {
  // Text to display in the menu
  text: string;
  // Path to link to when clicked
  path: string;
}

/* Specific admin routes to have navigation for */
const ADMIN_ROUTES: Route[] = [{ text: "Users", path: "/admin/users" }];

export const NavigationMenu = () => {
  // State of the navigation drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        <MenuIcon />
      </IconButton>
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250, height: "100%" }}
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
