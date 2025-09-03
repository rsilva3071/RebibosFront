
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Recibos from "./Recibos";
import Usuarios from "./Usuarios";
import ProtectedRoute from "./ProtectedRoute";
function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/recibos" element={<Recibos/>} />
        <Route path="/usuarios" element={<ProtectedRoute><Usuarios/></ProtectedRoute>} />
      </Routes>
      
    </Router>
  );
}

export default App
