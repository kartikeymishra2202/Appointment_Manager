import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorLogin.css"; 

const DoctorLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/doctor/signin",
        {
          email,
          password,
        }
      );

      alert("Login successful!");
      navigate("/"); 
    } catch (error) {
      alert("Invalid login credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <label>DOCTOR SIGN IN</label> 
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

export default DoctorLogin;
