import { useState, useEffect } from "react";
import axios from "axios";
import "./Available.css";

const AvailableSlots = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
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
        setError("Failed to load doctors.");
      }
    };
    fetchDoctors();
  }, []);

  const fetchSlots = async () => {
    if (!selectedDoctor) {
      alert("Please select a doctor.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/appointments/slots",
        {
          params: { doctorId: selectedDoctor, date },
        }
      );
      setSlots(response.data.availableSlots_);
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Available Slots</h1>

      <label>
        Select Doctor:
        <select
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
        >
          <option value="">--Select a Doctor--</option>
          {doctors.map((doctor) => (
            <option key={doctor._id} value={doctor._id}>
              {doctor.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <button onClick={fetchSlots} disabled={loading}>
        {loading ? "Loading..." : "Fetch Slots"}
      </button>

      {error && <p className="error">{error}</p>}

      <div>
        {slots.length === 0 && !loading ? (
          <p>No available slots found.</p>
        ) : (
          <ul>
            {slots.map((slot, index) => (
              <li key={index}>
                Date: {slot.date}, Time: {slot.time.start} - {slot.time.end}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AvailableSlots;
