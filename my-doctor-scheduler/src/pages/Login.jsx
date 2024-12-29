import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./PatientLogin.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/patients/signin",
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      localStorage.setItem("authToken", token);

      alert("Login successful!");
      navigate("/appointment");
    } catch (error) {
      alert("Invalid login credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <label>PATIENT SIGN IN </label>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
