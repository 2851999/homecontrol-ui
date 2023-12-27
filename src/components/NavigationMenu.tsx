"use client";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Box,
  Collapse,
  Divider,
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
  path?: string;
  // Nested routes
  routes?: Route[];
}

/* Standard routes all users have access to */
const STANDARD_ROUTES: Route[] = [{ text: "Home", path: "/" }];

/* Specific admin routes to have navigation for */
const ADMIN_ROUTES: Route[] = [
  { text: "Users", path: "/admin/users" },
  {
    text: "Devices",
    routes: [
      { text: "Air Conditioning", path: "/admin/devices/ac" },
      { text: "Hue Bridges", path: "/admin/devices/hue" },
      { text: "Broadlink", path: "/admin/devices/broadlink" },
    ],
  },
  {
    text: "Actions",
    routes: [{ text: "Broadlink", path: "/admin/actions/broadlink" }],
  },
  {
    text: "Scheduler",
    routes: [{ text: "Jobs", path: "/admin/scheduler/jobs" }],
  },
  { text: "Rooms", path: "/admin/rooms" },
];

interface NavigationButtonProps {
  text: string;
  path: string;
  offset: number;
  onNavigate: () => void;
}

const NavigationButton = (props: NavigationButtonProps) => {
  return (
    <ListItem
      key={props.path}
      component={Link}
      href={props.path}
      onClick={props.onNavigate}
      disablePadding
    >
      <ListItemButton sx={{ pl: props.offset }} dense>
        <ListItemText
          primary={props.text}
          primaryTypographyProps={{ color: "text.secondary" }}
        />
      </ListItemButton>
    </ListItem>
  );
};

interface NavigationSectionProps {
  text: string;
  routes: Route[];
  offset: number;
  onNavigate: () => void;
}

const NavigationSection = (props: NavigationSectionProps) => {
  // State of the section
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ListItem key={props.text} disablePadding>
        <ListItemButton
          sx={{ pl: props.offset }}
          dense
          onClick={() => setOpen(!open)}
        >
          <ListItemText
            primary={props.text}
            primaryTypographyProps={{
              color: "text.secondary",
            }}
          />
          {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {props.routes.map((route: Route) => {
            if (route.path)
              return (
                <NavigationButton
                  key={route.path}
                  text={route.text}
                  path={route.path}
                  offset={props.offset + 2}
                  onNavigate={props.onNavigate}
                />
              );
            else if (route.routes)
              return (
                <NavigationSection
                  text={route.text}
                  routes={route.routes}
                  offset={props.offset + 2}
                  onNavigate={props.onNavigate}
                />
              );
          })}
        </List>
      </Collapse>
    </>
  );
};

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
        >
          <List disablePadding>
            {STANDARD_ROUTES.map((route: Route) => {
              if (route.path)
                return (
                  <NavigationButton
                    key={route.path}
                    text={route.text}
                    path={route.path}
                    offset={2}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                );
              else if (route.routes)
                return (
                  <NavigationSection
                    key={`${route.text}-section`}
                    text={route.text}
                    routes={route.routes}
                    offset={2}
                    onNavigate={() => setDrawerOpen(false)}
                  />
                );
            })}
          </List>
          <AuthenticatedComponent adminOnly>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h5" px={2}>
              Admin
            </Typography>
            <List disablePadding>
              {ADMIN_ROUTES.map((route: Route) => {
                if (route.path)
                  return (
                    <NavigationButton
                      key={route.path}
                      text={route.text}
                      path={route.path}
                      offset={2}
                      onNavigate={() => setDrawerOpen(false)}
                    />
                  );
                else if (route.routes)
                  return (
                    <NavigationSection
                      key={`${route.text}-section`}
                      text={route.text}
                      routes={route.routes}
                      offset={2}
                      onNavigate={() => setDrawerOpen(false)}
                    />
                  );
              })}
            </List>
          </AuthenticatedComponent>
        </Box>
      </SwipeableDrawer>
    </>
  );
};
