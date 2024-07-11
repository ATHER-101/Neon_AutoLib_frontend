import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Badge, { BadgeProps } from "@mui/material/Badge";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Bookmark from "@mui/icons-material/Bookmark";
import TuneSharpIcon from "@mui/icons-material/TuneSharp";

import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useState } from "react";
import { Menu, MenuItem, styled } from "@mui/material";

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: 0,
    top: 11,
    border: `1px solid ${theme.palette.background.paper}`,
    padding: "4px",
  },
}));

export default function Navbar() {
  const [notifications, _setNotifications] = useState<number>(4);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <AppBar position="static" sx={{ bgcolor: "white" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Link to="/student">
              <IconButton
                size="large"
                edge="start"
                aria-label="open drawer"
                sx={{ mr: 1, color: "#FF5733" }}
              >
                <AutoStoriesIcon />
              </IconButton>
            </Link>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: { xs: "none", sm: "block" }, color: "#FF5733" }}
            >
              AutoLib
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "right",
              width: "100%",
            }}
          >
            <SearchBar />

            <Link to="/student/filter-books">
              <IconButton
                size="large"
                aria-label="show new notifications"
                sx={{ p: 1, color: "#FF5733" }}
              >
                <TuneSharpIcon sx={{ fontSize: 25 }} />
              </IconButton>
            </Link>
            <Link to="/student/bookmarks">
              <IconButton
                size="large"
                aria-label="show new notifications"
                sx={{ p: 1, color: "#FF5733" }}
              >
                <Bookmark />
              </IconButton>
            </Link>
            <Link to="/student/notifications">
              <IconButton
                size="large"
                aria-label="show new notifications"
                sx={{
                  p: 1,
                  color: "#FF5733",
                  display: { xs: "none", sm: "flex" },
                }}
              >
                <Badge
                  badgeContent={notifications}
                  sx={{
                    padding: "1px",
                  }}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Link>

            {/* profile */}
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ p: 1, color: "#FF5733" }}
              >
                <Badge
                  color="error"
                  variant="dot"
                  invisible={notifications == 0}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                >
                  <AccountCircle />
                </Badge>
                <AccountCircle sx={{ display: { xs: "none", sm: "flex" } }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <Link to="/student/notifications">
                  <MenuItem
                    sx={{ display: { xs: "inline-block", sm: "none" } }}
                    onClick={handleClose}
                  >
                    <StyledBadge badgeContent={notifications} color="error">
                      <Typography sx={{ pr: "15px" }}>Notifications</Typography>
                    </StyledBadge>
                  </MenuItem>
                </Link>
                <Link to="/logout">
                  <MenuItem onClick={handleClose}>LogOut</MenuItem>
                </Link>
              </Menu>
            </div>
            {/* profile */}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
