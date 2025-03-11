import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";
import {jwtDecode} from "jwt-decode"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // ✅ Initialize navigate

  const handleLogin = async () => {
    try {
        const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
        const { token } = res.data;

        // ✅ Store token in localStorage
        localStorage.setItem("token", token);

        // ✅ Decode token and store userId
        const decoded = jwtDecode<{ userId: string }>(token);
        localStorage.setItem("userId", decoded.userId);

        console.log("Login successful:", decoded);
        navigate("/chat");

    }catch (error) {
      const errMsg = (error as Error).message; 
      console.error("Login failed:", errMsg);
  }
};

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <button onClick={}>Register</button>
    </div>
  );
};

export default Login;
