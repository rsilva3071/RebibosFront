import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
} from "@mui/material";
import * as XLSX from "xlsx";
import { GetUsuarios, registerUser } from "./apis";
import Layout from "./Layout";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleGetUsuarios = async () => {
    const isTokenValid = () => {
        const token = localStorage.getItem("access");
        const expiration = localStorage.getItem("access_expiration");
      
        if (!token || !expiration) return false;
      
        return new Date().getTime() < Number(expiration);
      };
      if (!isTokenValid()) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("access_expiration");
        window.location.href = "/";
      }
    try {
      const response = await GetUsuarios();
      if (Array.isArray(response)) {
        setUsuarios(response);
        
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      console.error(error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    handleGetUsuarios();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(usuarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "usuarios.xlsx");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await registerUser(
        nuevoUsuario.username,
        nuevoUsuario.password,
        nuevoUsuario.email
      );
      setOpenModal(false);
      setNuevoUsuario({ username: "", email: "", password: "" });
      handleGetUsuarios();
    } catch (error) {
      console.error("❌ Error creando usuario:", error);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          bgcolor: "background.default",
          p: 3,
          borderRadius: 3,
          boxShadow: 3,
          mt: 4,
        }}
      >
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
        >
          <Typography variant="h4">Usuarios</Typography>
          <Box>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mr: 2 }}
              onClick={exportToExcel}
            >
              Exportar Excel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenModal(true)}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </Grid>

        {/* Tabla de usuarios */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Staff</TableCell>
                <TableCell>Superusuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usuarios.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_staff ? "✅" : "❌"}</TableCell>
                  <TableCell>{user.is_superuser ? "✅" : "❌"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Modal para crear usuario */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Crear Usuario
          </Typography>
          <Box component="form" onSubmit={handleCreateUser}>
            <TextField
              label="Usuario"
              fullWidth
              margin="normal"
              value={nuevoUsuario.username}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, username: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
              required
            />
            <TextField
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              value={nuevoUsuario.password}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Crear
            </Button>
          </Box>
        </Box>
      </Modal>
    </Layout>
  );
};

export default Usuarios;
