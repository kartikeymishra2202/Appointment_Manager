


Patient Appointment Management System (PAMS)
Patient Appointment Management System (PAMS) is a web application designed to help patients and doctors manage appointments efficiently. This project allows patients to sign up, log in, view available appointment slots, and book appointments with doctors. Doctors can manage their availability and view appointments booked by patients.

Table of Contents
Project Overview
Features
Tech Stack
Installation
Usage
Project Structure
API Endpoints
Contributing
License
Project Overview
The PAMS system allows users to:

Patients: Register, log in, view available doctors, check available slots, and book appointments.
Doctors: Register, log in, manage their available slots, and manage their appointments.
The project uses React for the frontend and Node.js with Express.js for the backend. The backend communicates with a MongoDB database to store user data, appointments, and available slots.

Features
Patient Features:

Sign up and log in with email and password.
View available doctors and book appointments.
Check available slots by selecting a doctor and date.
Doctor Features:

Sign up and log in with email and password.
Add, remove, or modify available slots.
View appointments booked by patients.
Appointment Booking:

Book appointments by selecting a doctor and available time slot.
Confirmation messages upon successful booking.
Notifications for appointment status.
Tech Stack
Frontend:

React.js
Axios (for HTTP requests)
CSS for styling (custom styles)
Backend:

Node.js
Express.js
MongoDB (for database management)
Authentication:

JWT (JSON Web Tokens)
Bcrypt for password hashing
Other:

Axios (for API calls)
React Router for navigation
Installation
Prerequisites
Before you begin, ensure you have the following installed:

Node.js: Download and Install Node.js
MongoDB: Download and Install MongoDB (if running locally)
Clone the Repository
bash
Copy code
git clone https://github.com/your-username/pams.git
cd pams
Backend Setup
Go to the backend directory:

bash
Copy code
cd server
Install dependencies:

bash
Copy code
npm install
Start the backend server:

bash
Copy code
npm start
The backend will run on http://localhost:3000.

Frontend Setup
Go to the frontend directory:

bash
Copy code
cd my-doctor-scheduler
Install dependencies:

bash
Copy code
npm install
Start the frontend development server:

bash
Copy code
npm start
The frontend will run on http://localhost:5173.

Usage
Once both the frontend and backend are running, you can navigate to http://localhost:5173 in your browser to access the application.

Patients can sign up, log in, view available doctors, check available slots, and book appointments.
Doctors can sign up, log in, manage available slots, and view appointments.

API Endpoints
Patient Routes
POST /api/v1/patients/signup: Patient sign-up
POST /api/v1/patients/signin: Patient login
GET /api/v1/appointments/slots: Get available slots for a specific doctor and date
POST /api/v1/appointments/book: Book an appointment
Doctor Routes
POST /api/v1/doctor/signup: Doctor sign-up
POST /api/v1/doctor/signin: Doctor login
GET /api/v1/doctor/list: Get list of doctors
POST /api/v1/doctor/slots: Add available slots for a doctor
DELETE /api/v1/doctor/slots: Remove a doctor's available slot
