import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Appointment from "./pages/Appointment";
import DoctorSignup from "./pages/DoctorSignup";
import DoctorLogin from "./pages/DoctorLogin";

function App() {
  return (
    <Router>
      <Routes>
        {/* Patient Routes */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/appointment" element={<Appointment />} />

        {/* Doctor Routes */}
        <Route path="/doctor/signup" element={<DoctorSignup />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
