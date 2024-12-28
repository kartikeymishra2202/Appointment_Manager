import React, { useState } from "react";
import axios from "axios";

const Appointment = () => {
  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorId: "",
    date: "",
    time: "",
  });

  const handleBookAppointment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("You need to log in to book an appointment.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/appointments/book",
        appointmentDetails,
        {
          headers: {
            authorization: `${token}`,
          },
        }
      );

      alert("Appointment booked successfully!");
    } catch (error) {
      alert("Failed to book appointment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleBookAppointment}>
      <input
        type="text"
        placeholder="Doctor ID"
        value={appointmentDetails.doctorId}
        onChange={(e) =>
          setAppointmentDetails({
            ...appointmentDetails,
            doctorId: e.target.value,
          })
        }
        required
      />
      <input
        type="date"
        value={appointmentDetails.date}
        onChange={(e) =>
          setAppointmentDetails({ ...appointmentDetails, date: e.target.value })
        }
        required
      />
      <input
        type="time"
        value={appointmentDetails.time}
        onChange={(e) =>
          setAppointmentDetails({ ...appointmentDetails, time: e.target.value })
        }
        required
      />
      <button type="submit">Book Appointment</button>
    </form>
  );
};

export default Appointment;
