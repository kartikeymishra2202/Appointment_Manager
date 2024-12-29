import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorId: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/doctor/list"
        );
        setDoctors(response.data.doctors);
      } catch (err) {
        setError("Failed to load doctors. Please try again later.");
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in to book an appointment.");
      return;
    }

    if (!appointmentDetails.doctorId) {
      alert("Please select a doctor.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "http://localhost:3000/api/v1/appointments/book",
        appointmentDetails,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      alert("Appointment booked successfully!");
      setAppointmentDetails({
        doctorId: "",
        date: "",
        time: "",
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to book appointment. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-container">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleBookAppointment}>
        <label className="form-label">
          Select Doctor:
          <select
            className="form-select"
            value={appointmentDetails.doctorId}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                doctorId: e.target.value,
              })
            }
          >
            <option value="">--Select a Doctor--</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-label">
          Date:
          <input
            className="form-input"
            type="date"
            value={appointmentDetails.date}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                date: e.target.value,
              })
            }
          />
        </label>
        <label className="form-label">
          Time:
          <input
            className="form-input"
            type="time"
            value={appointmentDetails.time}
            onChange={(e) =>
              setAppointmentDetails({
                ...appointmentDetails,
                time: e.target.value,
              })
            }
          />
        </label>
        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Appointment;
