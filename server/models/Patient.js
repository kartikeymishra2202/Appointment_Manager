import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: {
    type: String,
  },
});

export default mongoose.model("PatientModel", patientSchema);
