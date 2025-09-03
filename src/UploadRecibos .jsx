import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Papa from "papaparse";
import { CreateRecibo } from "./apis";

const UploadRecibos = ({ onFinish }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Selecciona un archivo CSV");

    setLoading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const rows = results.data;

        // Iterar y enviar uno por uno
        for (const row of rows) {
          const nuevoRecibo = {
            concepto: row.concepto,
            monto: row.monto,
            usuario: row.usuario,
            pagado: false,       // siempre false
            creado_en: new Date().toISOString(), // fecha actual
          };

          await CreateRecibo(nuevoRecibo);
        }

        setLoading(false);
        alert("✅ Todos los recibos fueron creados");
        if (onFinish) onFinish(); // refrescar lista si quieres
      },
      error: (err) => {
        console.error(err);
        setLoading(false);
        alert("❌ Error leyendo el CSV");
      },
    });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Subir CSV de Recibos</Typography>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{ marginTop: "8px", marginBottom: "12px" }}
      />
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Subiendo..." : "Subir y Crear Recibos"}
      </Button>
    </Box>
  );
};

export default UploadRecibos;
