import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser,getUserInfo } from "./apis";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
} from "@mui/material";
import Swal from "sweetalert2";
import Layout from "./Layout";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(username, password);
     
      const user = await getUserInfo();
     
      
      if (response.access) {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          text: `Hola ${user?.username || "usuario"} 👋`,
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/recibos");

      } else {
        Swal.fire({
          icon: "error",
          title: "Credenciales incorrectas",
          text: "Por favor revisa tu usuario y contraseña",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Por favor revisa tu usuario y contraseña",
      });
    }
  };

  return (
    <Layout>
    <Box
    sx={{
        height: "100vh",
        width: "100vw",         // Asegura ancho completo
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        margin: 0,              // Elimina margen externo si existe
        padding: 0,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Entrar
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
    </Layout>
  );
};

export default Login;
