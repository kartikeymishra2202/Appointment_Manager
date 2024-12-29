import express from "express";
import auth from "../middleware/auth.js";
import AppointmentModel from "../models/Appointment.js";
import DoctorModel from "../models/Doctor.js";
import findAvailableSlots from "../utils/FindAvailableSlot.js";

const appointmentRoutes = express.Router();

appointmentRoutes.post("/book", auth, async (req, res) => {
  const role = req.role;
  if (role === "patient") {
    const patientId = req.id;
    const { doctorId, date, time } = req.body;
    const Doctor = await DoctorModel.findById(doctorId);

    const hr = time.split(":")[0] - 0;
    const min = time.split(":")[1] - 0;
    const date_ = new Date(date);

    if (Doctor) {
      const availableDoctorSlot = Doctor.availableSlots.find((slot) => {
        const [startHour, startMinute] = slot.time.start.split(":").map(Number);
        const [endHour, endMinute] = slot.time.end.split(":").map(Number);

        //temporary fix for date comparison issue.
        // console.log(
        //   date_.toISOString(),
        //   typeof date_.toISOString(),
        //   slot.date.toISOString(),
        //   typeof slot.date.toISOString()
        // );
        if (slot.date.toISOString() !== date_.toISOString()) return false;

        const isAfterStart =
          hr > startHour || (hr === startHour && min >= startMinute);
        const isBeforeEnd =
          hr < endHour || (hr === endHour && min <= endMinute);

        return isAfterStart && isBeforeEnd;
      });
      if (!availableDoctorSlot) {
        return res
          .status(400)
          .json({ error: "No Doctor available at That Time" });
      }
    }

    //--

    const isSlotAvailable = async (doctorId, date, hr, min) => {
      const currentPatient = await AppointmentModel.find({
        doctorId,
        date,
        status: { $in: ["booked", "completed"] },
      });

      if (currentPatient.length === 0) return true;

      for (const appointment of currentPatient) {
        const [startHour, startMinute] = appointment.time
          .split(":")
          .map(Number);
        const [endHour, endMinute] = appointment.time.split(":").map(Number);

        const existingStart = startHour * 60 + startMinute;

        const existingEnd = endHour * 60 + endMinute;

        const newStart = hr * 60 + min;
        const newEnd = hr * 60 + min;

        if (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        ) {
          return false;
        }
      }
      return true;
    };
    const slotAvailable = await isSlotAvailable(doctorId, date, hr, min);
    if (!slotAvailable) {
      return res.status(400).json({ error: "Slot not available" });
    } else {
      //min is in String in order to convert it to number we use -0.
      //grasePeriodEnd calculation.

      const gracePeriodEnd_ = new Date();
      const gracePeriodHr = gracePeriodEnd_.getHours();
      const gracePeriodmin = gracePeriodEnd_.getMinutes();
      gracePeriodEnd_.setHours(gracePeriodHr, gracePeriodmin + 15, 0, 0);
      const gracePeriodEnd = `${gracePeriodEnd_.getHours()}:${gracePeriodEnd_.getMinutes()}`;

      const appointment = await AppointmentModel.create({
        doctorId,
        patientId,
        date,
        time,
        gracePeriodEnd,
      });
      res.status(201).json({
        message: "Appointment booked successfully",
        appointment,
      });
    }
  }
});

//confirm appointment
appointmentRoutes.patch("/confirm/:appointmentId", async (req, res) => {
  const { appointmentId } = req.params;
  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found" });
  }

  if (appointment.status !== "booked") {
    return res.status(400).json({ message: "Appointment cannot be confirmed" });
  }

  appointment.status = "confirmed";
  await appointment.save();

  res.status(200).json({ message: "Appointment confirmed", appointment });
});

/////////////////////////////////
//available appointments

appointmentRoutes.get("/slots", async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const appointmentDate = date || new Date().toISOString().split("T")[0];

    const doctor = await DoctorModel.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await AppointmentModel.find({
      doctorId,
      date: appointmentDate,
    }).sort({ time: 1 });

    const availableSlots_ = await findAvailableSlots(
      doctorId,
      appointmentDate,

      15
    );

    res.status(200).json({
      date: appointmentDate,
      doctor: { id: doctorId, name: doctor.name },
      availableSlots_,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Fetch missed appointments
appointmentRoutes.get("/missed", async (req, res) => {
  const appointments = await AppointmentModel.find({ status: "no-show" });
  res.json(appointments);
});

export default appointmentRoutes;
