import React, { useState } from "react";
import axios from "axios";

function Register({goBack, onSuccess}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const register = () => {
    axios
      .post("http://localhost:5000/register", { username, password })
      .then((response) => {
        setMessage("Registered successfully");
        onSuccess();
      })
      .catch((error) => {
        setMessage("Registration failed");
      });
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={register}>Register</button>
      <button onClick={goBack}>Voltar</button> 
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
