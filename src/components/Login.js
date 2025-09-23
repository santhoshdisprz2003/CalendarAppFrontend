import React, { useState } from "react";
import axios from "axios";
import "../Styles/Login.css";

const Login = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        // Register API call
        await axios.post("http://localhost:5000/api/auth/register", {
          username,
          password,
        });
        setMessage("Registration successful!");
        setIsRegister(false);
      } else {
        // Login API call
        const response = await axios.post("http://localhost:5000/api/auth/login", {
          username,
          password,
        });

        // Save token
        localStorage.setItem("token", response.data.token);

        onLogin(); // notify App.js
      }
    } catch (error) {
      setMessage("❌ " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      <p className="toggle-text">
        {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? "Login" : "Register"}
        </span>
      </p>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Login;
