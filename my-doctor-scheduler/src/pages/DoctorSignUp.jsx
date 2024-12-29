import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./DoctorSignup.css"; 

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    availableSlots: [{ date: "", time: { start: "", end: "" } }],
  });
  const navigate = useNavigate();

  const handleSlotChange = (index, e) => {
    const newSlots = [...formData.availableSlots];
    const { name, value } = e.target;

    if (name === "start" || name === "end") {
      newSlots[index].time[name] = value;
    } else {
      newSlots[index][name] = value;
    }

    setFormData({ ...formData, availableSlots: newSlots });
  };

  const handleAddSlot = () => {
    setFormData({
      ...formData,
      availableSlots: [
        ...formData.availableSlots,
        { date: "", time: { start: "", end: "" } },
      ],
    });
  };

  const handleRemoveSlot = (index) => {
    const newSlots = [...formData.availableSlots];
    newSlots.splice(index, 1);
    setFormData({ ...formData, availableSlots: newSlots });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/v1/doctor/signup", formData);
      alert("Doctor registered successfully!");
      navigate("/doctor/login");
    } catch (error) {
      alert("Error registering doctor. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <label>DOCTOR SIGN UP</label>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <h3>Available Slots</h3>
      {formData.availableSlots.map((slot, index) => (
        <div key={index} className="slot">
          <input
            type="date"
            name="date"
            value={slot.date}
            onChange={(e) => handleSlotChange(index, e)}
            required
          />
          <input
            type="time"
            name="start"
            value={slot.time.start}
            onChange={(e) => handleSlotChange(index, e)}
            required
          />
          <input
            type="time"
            name="end"
            value={slot.time.end}
            onChange={(e) => handleSlotChange(index, e)}
            required
          />
          {formData.availableSlots.length > 1 && (
            <button
              type="button"
              onClick={() => handleRemoveSlot(index)}
              className="removeButton"
            >
              Remove Slot
            </button>
          )}
        </div>
      ))}

      <button type="button" onClick={handleAddSlot}>
        Add Slot
      </button>

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default DoctorSignup;
