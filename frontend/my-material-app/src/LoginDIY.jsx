import React, { useState } from "react";
import axios from "axios";

function Login({ goBack, onSuccess, updateUsername, isAdmin, setIsAdmin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = () => {
    axios
      .post("http://localhost:5000/login", { username, password })
      .then((response) => {
        localStorage.setItem("access_token", response.data.access_token);
        updateUsername(username);
        setMessage("Logged in successfully");
        onSuccess();
      })
      .catch((error) => {
        if (error.response && error.response.data.message) {
          setMessage(error.response.data.message);
        } else {
          setMessage("Invalid credentials");
        }
      });
    if (username == "admin@admin.com") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
      <button onClick={goBack}>Voltar</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;
