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
import { useEffect, useState } from "react";
import { AuthenticatedComponent } from "./Authenticated";

/* Specific paths that the app bar should not be shown on */
const hiddenPathnames: string[] = ["/logout", "/login", "/register"];

interface Route {
  text: string;
  path: string;
}

/* Specific admin routes to have navigation for */
const adminRoutes: Route[] = [{ text: "Users", path: "/admin/users" }];

export const HomeControlAppBar = () => {
  // State of the navigation drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Don't show on certain pages
  const pathname = usePathname();

  // Close the navigation drawer when a link inside it is clicked
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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
          <Button component={Link} href="/">
            <Typography
              variant="h6"
              color="primary.contrastText"
              textTransform="none"
            >
              HomeControl
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} marginTop={7} role="presentation">
          <AuthenticatedComponent adminOnly>
            <Typography variant="h5" px={2}>
              Admin
            </Typography>
            <List disablePadding>
              {adminRoutes.map((route: Route) => (
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
