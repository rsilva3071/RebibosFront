import React, { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
import { getUserInfo } from "./apis";

const Layout = ({ children }) => {
  const location = useLocation(); // <-- obtenemos la ruta actual
  const [usuario, setUsuario] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("access_expiration");
    window.location.href = "/";
  };

  const handleGetUsuario = async () => {
    try {
      const response = await getUserInfo();
      if (response) setUsuario(response);
      else setUsuario(null);
    } catch (error) {
      console.error(error);
      setUsuario(null);
    }
  };

  useEffect(() => {
    handleGetUsuario();
  }, []);

  const toggleDrawer = (open) => () => {
    setOpenDrawer(open);
  };

  const isRoot = location.pathname === "/"; // <-- si estamos en "/"

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header y Drawer solo si NO estamos en "/" */}
      {!isRoot && (
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={toggleDrawer(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">Mi Dashboard</Typography>
            </Toolbar>
          </AppBar>

          <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer(false)}>
            <Box
              sx={{ width: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
            >
              <List>
                <ListItem button component={Link} to="/recibos">
                  <ListItemText primary="Recibos" />
                </ListItem>
                <ListItem button onClick={logout}>
                  <ListItemText primary="Cerrar sesión" />
                </ListItem>
                {usuario?.is_superuser && (
                  <>
                    <ListItem button component={Link} to="/dashboard">
                      <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/usuarios">
                      <ListItemText primary="Usuarios" />
                    </ListItem>
                  </>
                )}
              </List>
            </Box>
          </Drawer>
        </>
      )}

      {/* Main content */}
      <Container sx={{ flexGrow: 1, p: 4 }}>{children}</Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          backgroundColor: "primary.main",
          color: "white",
          textAlign: "center",
        }}
      >
        © 2025 Mi App
      </Box>
    </Box>
  );
};

export default Layout;
