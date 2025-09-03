import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { GetRecibos } from "./apis";
import Layout from "./Layout";
import UploadRecibos from "./UploadRecibos ";

const Dashboard = () => {

  
  const [recibos, setRecibos] = useState([]);
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
  const handleGetRecibos = async () => {
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

  useEffect(() => {
    handleGetRecibos();
  }, []);

  // Dataset para gráfica de barras (costos por concepto)
  const dataBarras = recibos.map((r) => ({
    concepto: r.concepto,
    monto: Number(r.monto),
  }));

  // Dataset para gráfica de pastel (pagados vs no pagados)
  const pagados = recibos.filter((r) => r.pagado).length;
  const noPagados = recibos.filter((r) => !r.pagado).length;
  const dataPie = [
    { name: "Pagados", value: pagados },
    { name: "No Pagados", value: noPagados },
  ];

  const COLORS = ["#4caf50", "#f44336"]; // verde pagados, rojo no pagados

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
        <Typography variant="h3" sx={{ mb: 4 }}>
          Dashboard de Recibos
        </Typography>

        <Grid container spacing={3}>
          {/* Gráfica de barras */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper sx={{ p: 3, borderRadius: 3, flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Costos por Concepto
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dataBarras}>
                  <XAxis dataKey="concepto" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="monto" fill="#1976d2" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Gráfica de pastel */}
          <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Paper sx={{ p: 3, borderRadius: 3, flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Estado de Recibos
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dataPie}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {dataPie.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
                <UploadRecibos></UploadRecibos>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
