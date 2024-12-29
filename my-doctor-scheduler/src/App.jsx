import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import DoctorSignup from "./pages/DoctorSignUp";
import DoctorLogin from "./pages/DoctorLogin";
import AvailableSlots from "./components/AvailableShare";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment" element={<Appointment />} />

        <Route path="/available-slots" element={<AvailableSlots />} />

        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
