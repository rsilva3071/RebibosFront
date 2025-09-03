import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Paper,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem   
} from "@mui/material";
import Layout from "./Layout";
import { GetRecibos, CreateRecibo, CreatePago, GetUsuarios } from "./apis";

const Recibos = () => {
  const [recibos, setRecibos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [nuevoRecibo, setNuevoRecibo] = useState({
    monto: "",
    fecha: "",
    descripcion: "",
    cliente_id: "",
    concepto: "",
  });
  const [usuarios, setUsers] = useState([]);

  // Estados para el modal de pago
  const [openPago, setOpenPago] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [montoPago, setMontoPago] = useState("");

  const handleGetUsuarios = async () => {
    try {
      const response = await GetUsuarios();
      if (Array.isArray(response)) {
        const filteredUsers = response.filter((u) => !u.is_superuser); 
        setUsers(filteredUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  // Obtener recibos
  const handleGetRecibos = async () => {
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
      const response = await GetRecibos();
      if (Array.isArray(response)) {
        setRecibos(response);
      } else {
        setRecibos([]);
      }
    } catch (error) {
      console.error(error);
      setRecibos([]);
    }
  };

  // Modal de crear recibo
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const handleChange = (e) => {
    setNuevoRecibo({
      ...nuevoRecibo,
      [e.target.name]: e.target.value,
    });
  };
  const handleCreateRecibo = async (e) => {
    e.preventDefault();
    try {
      await CreateRecibo(nuevoRecibo);
      handleCloseModal();
      handleGetRecibos();
    } catch (error) {
      console.error("Error creando recibo:", error);
    }
  };

  // Modal de pago
  const handleOpenPagoModal = (recibo) => {
    setReciboSeleccionado(recibo);
    setMontoPago(recibo.monto); // prellenar con monto del recibo
    setOpenPago(true);
  };
  const handleClosePagoModal = () => {
    setOpenPago(false);
    setReciboSeleccionado(null);
    setMontoPago("");
  };
  const handleConfirmarPago = async () => {
    if (!reciboSeleccionado) return;

    const pago = await CreatePago(reciboSeleccionado.id, montoPago);
    if (pago) {
      alert("Pago realizado con éxito");
      setRecibos((prev) =>
        prev.map((r) =>
          r.id === reciboSeleccionado.id ? { ...r, pagado: true } : r
        )
      );
      handleClosePagoModal();
    } else {
      alert("Error al procesar el pago");
    }
  };

  useEffect(() => {
    handleGetRecibos();
    handleGetUsuarios();
  }, []);

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
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Recibos
          </Typography>
          <Button
            variant="outlined"
            onClick={handleOpenModal}
            sx={{
                bgcolor: "white",             // Fondo blanco
                color: "primary.main",        // Texto azul
                borderColor: "primary.main",  // Borde azul
                "&:hover": {
                bgcolor: "white",           // Mantener fondo blanco al hover
                borderColor: "primary.dark" // Borde más oscuro al hover
                },
            }}
            >
            Nuevo Recibo
            </Button>
        </Grid>
        <Divider sx={{ mb: 2 }} />

        {recibos.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No hay recibos disponibles.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {recibos.map((recibo) => (
              <Grid item xs={12} sm={6} md={4} key={recibo.id}>
                <Paper
                  elevation={3}
                  sx={{
                    borderRadius: 2,
                    p: 3,
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {recibo.concepto}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Usuario ID: {recibo.usuario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fecha: {new Date(recibo.creado_en).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pagado: {recibo.pagado ? "Sí" : "No"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      mt: 2,
                      alignSelf: "center",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      borderRadius: "50%",
                      width: 80,
                      height: 80,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    ${recibo.monto}
                  </Box>

                  {!recibo.pagado && (
                    <Button
                      variant="contained"
                      color="success"
                      sx={{
                        m:1,
                        bgcolor: "white",             // Fondo blanco
                        color: "primary.main",        // Texto azul
                        borderColor: "primary.main",  // Borde azul
                        "&:hover": {
                        bgcolor: "white",           // Mantener fondo blanco al hover
                        borderColor: "primary.dark" // Borde más oscuro al hover
                        },
                    }}
                      onClick={() => handleOpenPagoModal(recibo)}
                    >
                      Pagar
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Modal para crear recibo */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 4,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Crear Recibo
            </Typography>
            <Box component="form" onSubmit={handleCreateRecibo}>
              <TextField
                name="monto"
                label="Monto"
                type="number"
                fullWidth
                margin="normal"
                value={nuevoRecibo.monto}
                onChange={handleChange}
                required
              />
              <TextField
                name="fecha"
                label="Fecha"
                type="date"
                fullWidth
                margin="normal"
                value={nuevoRecibo.fecha}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
              <TextField
                name="concepto"
                label="Concepto"
                fullWidth
                margin="normal"
                value={nuevoRecibo.concepto}
                onChange={handleChange}
                required
              />
               <FormControl fullWidth margin="normal" required>
                <InputLabel>Usuario</InputLabel>
                <Select name="cliente_id" value={nuevoRecibo.cliente_id} onChange={handleChange} label="Usuario">
                  {usuarios.map((u) => (
                    <MenuItem key={u.id} value={u.id}>
                      {u.email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                Crear
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Modal de pago */}
        <Modal open={openPago} onClose={handleClosePagoModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              borderRadius: 2,
              p: 4,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pagar Recibo
            </Typography>
            <TextField
              label="Monto a pagar"
              type="number"
              fullWidth
              margin="normal"
              value={montoPago}
              onChange={(e) => setMontoPago(e.target.value)}
            />
            <Button
              variant="contained"
              color="success"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleConfirmarPago}
            >
              Confirmar Pago
            </Button>
          </Box>
        </Modal>
      </Box>
    </Layout>
  );
};

export default Recibos;
