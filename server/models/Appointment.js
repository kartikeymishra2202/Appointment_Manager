import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: {
    type: String,
    enum: ["booked", "completed", "missed", "no-show", "confirmed"],
    default: "booked",
  },
  gracePeriodEnd: { type: String, required: true },
});

export default mongoose.model("AppointmentModel", appointmentSchema);
