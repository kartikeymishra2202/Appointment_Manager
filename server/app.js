import express from "express";
import patientRoutes from "./routes/PatientRoutes.js";
import AppointmentModel from "./models/Appointment.js";
import DoctorModel from "./models/Doctor.js";
import PatientModel from "./models/Patient.js";
import cors from "cors";

import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

import doctorRoutes from "./routes/DoctorRoutes.js";
import appointmentRoutes from "./routes/AppointmentRoutes.js";
import sendEmail from "./utils/sendNotification.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/v1/patients", patientRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/appointments", appointmentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

setInterval(async () => {
  const now = new Date();
  const missedAppointments = await AppointmentModel.find({
    status: "booked",
  });
  if (missedAppointments.length === 0) return;
  for (const appointment of missedAppointments) {
    const [graceHour, graceMinute] = appointment.gracePeriodEnd
      .split(":")
      .map(Number);

    const gracePeriodEnd = new Date(appointment.date);
    gracePeriodEnd.setHours(graceHour, graceMinute, 0, 0);

    if (gracePeriodEnd < now) {
      appointment.status = "no-show";
      await appointment.save();

      // Notify doctor and patient about no-show
      const doctor = await DoctorModel.findById(appointment.doctorId);
      const patient = await PatientModel.findById(appointment.patientId);

      if (!doctor || !patient) return;

      // Send email notifications
      const subject = "Appointment No-Show Notification";
      const text = `Dear ${doctor.name} and ${patient.name},

The appointment scheduled on ${appointment.date} at ${appointment.time} has been marked as a missed.

Thank you,
Your Clinic`;

      // Send email notifications to both the doctor and patient
      await sendEmail(doctor.email, subject, text);
      await sendEmail(patient.email, subject, text);

      console.log(
        `No-show notifications sent for appointment ID: ${appointment._id}`
      );
    }
  }
}, 5 * 60 * 1000);

export default app;
