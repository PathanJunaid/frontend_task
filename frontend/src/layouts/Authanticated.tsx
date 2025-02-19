import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../services/api";
import { useAppSelector } from "../store/store";

export default function Authenticated() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutMutation();

  const handleMenuToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget); // Toggle menu on button click
  };

  const handleClose = () => {
    setAnchorEl(null); // Close menu
  };

  const handleMenuItemClick = (route: "profile" | "logout") => {
    handleClose(); // Close the menu first
    if (route === "logout") {
      logoutUser();
    } else {
      navigate(`/${route}`);
    }
  };

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* App Title */}
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "white" }}
          >
            <Typography variant="h6" fontWeight="bold">
              ChitChat
            </Typography>
          </Box>

          {/* Profile Dropdown Menu */}
          {isAuthenticated && (
            <Box>
              <IconButton
                size="large"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuToggle}
                color="inherit"
                sx={{p: 1.5}}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={() => handleMenuItemClick("profile")}>
                  Profile
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick("logout")}>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Outlet />
    </Box>
  );
}
