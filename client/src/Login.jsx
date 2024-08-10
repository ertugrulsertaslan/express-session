import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const data = {
      username: username,
      password: password,
    };
    await axios
      .post("http://localhost:5000/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        navigate("/");
        console.log(response);
      })
      .catch((error) => {
        navigate("/login");
        console.error("Logout error:", error);
      });
  };
  return (
    <>
      <h1>Login</h1>

      <input
        type="text"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" onClick={handleSubmit}>
        Login
      </button>
    </>
  );
}

export default Login;
