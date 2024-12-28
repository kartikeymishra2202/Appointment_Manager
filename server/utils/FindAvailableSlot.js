import DoctorModel from "../models/Doctor.js";
import AppointmentModel from "../models/Appointment.js";

const findAvailableSlots = async (doctorId, date) => {
  const doctor = await DoctorModel.findById(doctorId);
  if (!doctor) {
    throw new Error("Doctor not found");
  }

  const availableSlots = doctor.availableSlots.filter(
    (slot) => new Date(slot.date).toISOString().split("T")[0] === date
  );

  if (!availableSlots || availableSlots.length === 0) {
    throw new Error("No available slots found for the given date");
  }

  const appointments = await AppointmentModel.find({
    doctorId,
    date,
    status: { $in: ["booked", "confirmed"] },
  }).sort({
    time: 1,
  });

  const bookedSlots = appointments.map((appointment) => appointment.time);

  const unbookedSlots = availableSlots.filter((slot) => {
    return !bookedSlots.includes(slot.time.start);
  });

  return unbookedSlots;
};

export default findAvailableSlots;
