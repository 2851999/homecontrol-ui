import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { AuthenticationContext } from "./AuthenticationProvider";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppDispatch } from "../state/hooks";
import { themeModeSelector, toggleTheme } from "../state/settingsSlice";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { handleLogout } from "../authentication";

export const AccountMenu = () => {
  // Open when not null
  const [accountMenuAnchorEl, setAccountMenuAnchorEl] =
    useState<null | HTMLElement>(null);

  // Closes the menu
  const handleAccountMenuClose = () => {
    setAccountMenuAnchorEl(null);
  };

  // Current user
  const [user, setUser] = useContext(AuthenticationContext);

  // For logging out
  const router = useRouter();
  const handleLogoutClicked = async () => {
    await handleLogout(router);
  };

  // For toggling theme
  const dispatch = useAppDispatch();
  const currentThemeMode = useSelector(themeModeSelector);
  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return user ? (
    <>
      <IconButton
        aria-label="account of current user"
        aria-controls="account-menu-appbar"
        aria-haspopup="true"
        onClick={(event: React.MouseEvent<HTMLElement>) =>
          setAccountMenuAnchorEl(event.currentTarget)
        }
      >
        <AccountCircleIcon sx={{ color: "primary.contrastText" }} />
      </IconButton>
      <Menu
        id="account-menu-appbar"
        anchorEl={accountMenuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={Boolean(accountMenuAnchorEl)}
        onClose={handleAccountMenuClose}
      >
        <Box sx={{ mx: 2, my: 1 }}>
          Logged in as:
          <Typography color="secondary">{user.username}</Typography>
        </Box>
        <MenuItem onClick={handleLogoutClicked}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleToggleTheme}>
          <ListItemIcon>
            {currentThemeMode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </ListItemIcon>
          <ListItemText>Toggle theme</ListItemText>
        </MenuItem>
      </Menu>
    </>
  ) : null;
};
