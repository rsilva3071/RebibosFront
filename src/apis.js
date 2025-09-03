export const getUserInfo = async () => {
  const token = localStorage.getItem("access");

  const response = await fetch("http://52.14.20.207:8000/api/user/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener el usuario");
  }

  const data = await response.json();
  
  return data;
};

export const GetUsuarios = async () => {
  const token = localStorage.getItem("access");

  const response = await fetch("http://52.14.20.207:8000/api/usuarios/", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo obtener la lista de usuarios");
  }

  const data = await response.json();
  return data;
};

export const registerUser = async (username="robert", password="1234", email="mail1@mail.com") => {
  const token = localStorage.getItem("access");
  const response = await fetch("http://52.14.20.207:8000/api/CreateUser/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ username, password, email }),
  });

  if (!response.ok) {
    throw new Error("Error en registro");
  }

  const data = await response.json();
  
  return data;
};

export const GetUser = async () => {
    let admin="admin"
    try {
      const response = await fetch(`https://m50gdbvpod.execute-api.us-west-2.amazonaws.com/user/${admin}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("Error al traer la API:", error);
      return null;
    }
  };


  export const GetRecibos = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(`http://localhost:8000/api/recibos/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      });
  
      
      if (!response.ok) {
        throw new Error("Error en la petición");
      }
      const data = await response.json();
      return data;
  
    } catch (error) {
      console.error("Error al traer la API:", error);
      return null;
    }
  };
  
  export const loginUser = async (username, password) => {
    const response = await fetch("http://52.14.20.207:8000/api/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  
    if (!response.ok) {
      throw new Error("Error en login");
    }
  
    const data = await response.json();
    
  
    // Guardamos el token en localStorage
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);
    localStorage.setItem("access_expiration", new Date().getTime() + 5*60*1000);
    return data;
  };


  

  
  
export const CreateRecibo = async (nuevoRecibo) => {
  
  
  try {
    const token = localStorage.getItem("access");
    
    
    const response = await fetch("http://52.14.20.207:8000/api/recibos/crear/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, 
      },
      body:JSON.stringify(nuevoRecibo),
    });

    if (!response.ok) {
      throw new Error("Error al crear recibo");
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("❌ Error en CreateRecibo:", error);
    return null;
  }
};


export const CreatePago = async (reciboId, monto) => {
  try {
    const token = localStorage.getItem("access");

    const response = await fetch("http://52.14.20.207:8000/api/pagos/crear/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        recibo: reciboId,
        monto: monto
      }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el pago");
    }

    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error("❌ Error en CreatePago:", error);
    return null;
  }
};

// auth.js
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;

  try {
    const res = await fetch("http://52.14.20.207:8000/api/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error("Refresh token fallido");

    const data = await res.json();
    localStorage.setItem("access", data.access);
    return data.access;
  } catch (err) {
    console.error(err);
    return null;
  }
};