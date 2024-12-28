import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  availableSlots: [
    {
      date: { type: Date },
      time: { start: { type: String }, end: { type: String } },
    },
  ],
  password: {
    type: String,
  },
});

export default mongoose.model("DoctorModel", doctorSchema);
