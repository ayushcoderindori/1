// src/components/ResponsiveDrawer.jsx
import React, { useContext, useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Chip,
  Badge,
  Tooltip,
  Fade,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Chat as ChatIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Star as StarIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import { useThemeMode } from "../context/ThemeContext.jsx";

const drawerWidth = 280;

export default function ResponsiveDrawer({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useThemeMode();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setOpen((v) => !v);
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
      setQ("");
    }
  };
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await logout();
    handleAvatarClose();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", icon: <HomeIcon />, text: "Home", badge: null },
    { path: "/dashboard", icon: <DashboardIcon />, text: "Dashboard", badge: null },
    { path: "/upload", icon: <UploadIcon />, text: "Upload Video", badge: null },
    { path: "/videos", icon: <VideoLibraryIcon />, text: "My Videos", badge: null },
    { path: "/messages", icon: <ChatIcon />, text: "Global Chat", badge: "New" },
    { path: "/conversations", icon: <MessageIcon />, text: "Direct Messages", badge: null },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* APP BAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          transition: (t) =>
            t.transitions.create(["width", "margin"], {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: open ? `${drawerWidth}px` : 0,
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          color: "text.primary",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 2, sm: 3 },
            minHeight: 70,
          }}
        >
          {/* Left: Drawer Toggle + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton 
                onClick={toggleDrawer} 
                edge="start"
                sx={{
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  color: "primary.main",
                  "&:hover": {
                    backgroundColor: "rgba(99, 102, 241, 0.2)"
                  }
                }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                BarterSkills
              </Typography>
            </motion.div>
          </Box>

          {/* Center: Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Box
              component="form"
              onSubmit={onSearchSubmit}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: 3,
                px: 2,
                py: 1,
                mx: "auto",
                width: {
                  xs: open ? "60%" : "50%",
                  sm: open ? "45%" : "35%",
                  md: open ? "40%" : "30%",
                },
                transition: (t) =>
                  t.transitions.create("width", {
                    easing: t.transitions.easing.sharp,
                    duration: t.transitions.duration.shorter,
                  }),
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)"
                }
              }}
            >
              <InputBase
                placeholder="Search videos, creators..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{ 
                  flex: 1, 
                  color: "text.primary",
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.7
                  }
                }}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton 
                  type="submit" 
                  sx={{ 
                    color: "primary.main",
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.2)"
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>

          {/* Right: Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton 
                  onClick={toggleMode}
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.2)"
                    }
                  }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="Notifications">
                <IconButton
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.2)"
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </motion.div>

            {user && (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Premium">
                    <Chip
                      label="Premium"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(245, 158, 11, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer"
                      }}
                      onClick={() => navigate("/premium")}
                    />
                  </Tooltip>
                </motion.div>

                <Typography
                  variant="body2"
                  sx={{ 
                    color: "text.primary", 
                    fontWeight: 600,
                    mx: 1
                  }}
                >
                  {user.username}
                </Typography>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Tooltip title="Profile menu">
                    <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                      <Avatar 
                        src={user.avatar} 
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: "2px solid rgba(99, 102, 241, 0.2)",
                          cursor: "pointer"
                        }} 
                      />
                    </IconButton>
                  </Tooltip>
                </motion.div>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAvatarClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 8,
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 200,
                      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to={`/profile/${user.username}`}
                    onClick={handleAvatarClose}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)"
                      }
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, color: "primary.main" }} />
                    My Profile
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/settings"
                    onClick={handleAvatarClose}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)"
                      }
                    }}
                  >
                    <SettingsIcon sx={{ mr: 2, color: "primary.main" }} />
                    Settings
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)"
                      }
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
            backdropFilter: "blur(10px)",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "4px 0 20px rgba(0, 0, 0, 0.1)"
          },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Box sx={{ p: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Navigation
            </Typography>
          </motion.div>
        </Box>
        <Divider sx={{ mx: 2 }} />
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive(item.path) 
                    ? "rgba(99, 102, 241, 0.1)" 
                    : "transparent",
                  color: isActive(item.path) ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive(item.path)
                      ? "rgba(99, 102, 241, 0.15)"
                      : "rgba(99, 102, 241, 0.05)"
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.15)"
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive(item.path) ? "primary.main" : "text.secondary",
                  minWidth: 40
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    fontWeight: isActive(item.path) ? 600 : 500
                  }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    color="error"
                    sx={{ 
                      height: 20, 
                      fontSize: "0.7rem",
                      fontWeight: 600
                    }}
                  />
                )}
              </ListItemButton>
            </motion.div>
          ))}
          
          <Divider sx={{ my: 2 }} />
          
          {user && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/profile/${user.username}`}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.05)"
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar 
                      src={user.avatar} 
                      sx={{ 
                        width: 28, 
                        height: 28,
                        border: "2px solid rgba(99, 102, 241, 0.2)"
                      }} 
                    />
                  </ListItemIcon>
                  <ListItemText 
                    primary="My Profile" 
                    secondary={user.username}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: "0.8rem" }}
                  />
                </ListItemButton>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <ListItemButton 
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.1)"
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: "error.main",
                    minWidth: 40
                  }}>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </motion.div>
            </>
          )}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10, // push below AppBar
          transition: (t) =>
            t.transitions.create("margin", {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          ml: open ? `${drawerWidth}px` : 0,
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)"
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </Box>
  );
}
