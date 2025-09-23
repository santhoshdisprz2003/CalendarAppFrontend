import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import Login from "./components/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
  },
});

// 🔹 Helper to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const { exp } = jwtDecode(token); // exp = expiry time in seconds
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }

    // 🔹 Axios interceptor for auto-logout on 401
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isLoggedIn ? (
        <Calendar />
      ) : (
        <Login onLogin={() => setIsLoggedIn(true)} />
      )}
    </ThemeProvider>
  );
}

export default App;
