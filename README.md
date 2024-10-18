HR Management System

An HR Management System where employees and managers can manage profiles, attendance, leave applications, and reviews efficiently. This system uses Geofencing for accurate attendance marking, and employees can upload their resumes or certifications. The platform uses Node.js, Express.js, MongoDB, React, Redux, JWT, and Multer.

Features

1. Employee Features:
Sign up & Login: Secure JWT-based authentication.
Profile Page: Employees can view their username, email, department, job title, rating, review, and manager's name.
Attendance: Employees can mark their attendance, which is validated through Geofencing. Attendance will only be marked if the employee is within a 100-meter radius.
Leave Application: Employees can apply for leave and view their total and remaining leave balances.
Document Upload: Employees can upload resumes and certificates using Multer.

3. Manager Features:
Sign up & Login: Managers can sign up and login securely.
Manage Employees: Managers can view all employees assigned to them.
Review and Rating: Managers can give performance reviews and ratings to their employees.
Approve/Reject Leave: Managers can approve or reject leave applications from their employees.
Technologies Used
Backend:
Node.js: JavaScript runtime for server-side development.
Express.js: Backend framework to manage API routes and middleware.
MongoDB: Database to store employee, manager, and attendance data.
JWT: JSON Web Tokens for secure authentication.
Multer: Middleware for file uploads, used to upload resumes and certificates.
Geofencing: Attendance marking is validated based on geographic location.
Frontend:
React: JavaScript library for building user interfaces.
Redux: For state management, making it easier to manage application state.
Installation
Backend Setup
Clone the repository:
bash
Copy code
git clone https://github.com/yourusername/hr-management-system.git
cd hr-management-system
Install dependencies:
bash
Copy code
npm install
Set up your environment variables by creating a .env file in the root directory:
makefile
Copy code
PORT=5000
EXPRESS_SESSION_SECRET=your_session_secret
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
Start the server:
bash
Copy code
npm start
Frontend Setup
Navigate to the frontend directory:
bash
Copy code
cd client
Install frontend dependencies:
bash
Copy code
npm install
Start the React application:
bash
Copy code
npm start

Multer Configuration for File Upload
Employees can upload their resumes and certificates, which are saved on the server using Multer. The uploaded files are stored in the uploads/documents directory. Make sure the server has permission to write to the designated upload directory.

API Endpoints

Employee Routes
POST /employe/signup: Employee signup.
POST /employe/login: Employee login.
GET /employe/profile: Fetch employee profile data.
POST /employe/attendance: Mark attendance (Geofencing check required).
POST /employe/leave/apply: Apply for leave.
POST /employe/upload: Upload resume or certificate (via Multer).

Manager Routes
POST /manager/signup: Manager signup.
POST /manager/login: Manager login.
GET /manager/employees: Fetch employees assigned to the manager.
POST /manager/review: Submit performance reviews for employees.
POST /manager/leave/approve: Approve/reject leave applications.
Geofencing Logic
Geofencing is implemented to ensure that employees can only mark attendance if they are within a 100-meter radius of the manager's predefined coordinates. This improves the accuracy and accountability of the attendance system.

State Management (Redux)
Redux is used to manage the state of the application, handling authentication, profile management, attendance status, leave applications, and manager actions in a streamlined manner.
