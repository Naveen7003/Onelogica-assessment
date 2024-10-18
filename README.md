<h1>HR Management System</h1>
    <p>
        An HR Management System where employees and managers can manage profiles, attendance, leave applications, and reviews efficiently. 
        This system uses Geofencing for accurate attendance marking, and employees can upload their resumes or certifications. 
        The platform uses <strong>Node.js</strong>, <strong>Express.js</strong>, <strong>MongoDB</strong>, <strong>React</strong>, 
        <strong>Redux</strong>, <strong>JWT</strong>, and <strong>Multer</strong>.
    </p>

    <h2>Features</h2>

    <h3>1. Employee Features:</h3>
    <ul>
        <li><strong>Sign up & Login:</strong> Secure JWT-based authentication.</li>
        <li><strong>Profile Page:</strong> Employees can view their username, email, department, job title, rating, review, and manager's name.</li>
        <li><strong>Attendance:</strong> Employees can mark their attendance, which is validated through <strong>Geofencing</strong>. Attendance will only be marked if the employee is within a 100-meter radius.</li>
        <li><strong>Leave Application:</strong> Employees can apply for leave and view their total and remaining leave balances.</li>
        <li><strong>Document Upload:</strong> Employees can upload resumes and certificates using <strong>Multer</strong>.</li>
    </ul>

    <h3>2. Manager Features:</h3>
    <ul>
        <li><strong>Sign up & Login:</strong> Managers can sign up and login securely.</li>
        <li><strong>Manage Employees:</strong> Managers can view all employees assigned to them.</li>
        <li><strong>Review and Rating:</strong> Managers can give performance reviews and ratings to their employees.</li>
        <li><strong>Approve/Reject Leave:</strong> Managers can approve or reject leave applications from their employees.</li>
    </ul>

    <h2>Technologies Used</h2>

    <h3>Backend:</h3>
    <ul>
        <li><strong>Node.js:</strong> JavaScript runtime for server-side development.</li>
        <li><strong>Express.js:</strong> Backend framework to manage API routes and middleware.</li>
        <li><strong>MongoDB:</strong> Database to store employee, manager, and attendance data.</li>
        <li><strong>JWT:</strong> JSON Web Tokens for secure authentication.</li>
        <li><strong>Multer:</strong> Middleware for file uploads, used to upload resumes and certificates.</li>
        <li><strong>Geofencing:</strong> Attendance marking is validated based on geographic location.</li>
    </ul>

    <h3>Frontend:</h3>
    <ul>
        <li><strong>React:</strong> JavaScript library for building user interfaces.</li>
        <li><strong>Redux:</strong> For state management, making it easier to manage application state.</li>
    </ul>

    <h2>Installation</h2>

    <h3>Backend Setup</h3>
    <ol>
        <li>Clone the repository:
            <pre><code>git clone https://github.com/yourusername/hr-management-system.git
cd hr-management-system</code></pre>
        </li>
        <li>Install dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Set up your environment variables by creating a <code>.env</code> file in the root directory:
            <pre><code>PORT=5000
EXPRESS_SESSION_SECRET=your_session_secret
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret</code></pre>
        </li>
        <li>Start the server:
            <pre><code>npm start</code></pre>
        </li>
    </ol>

    <h3>Frontend Setup</h3>
    <ol>
        <li>Navigate to the frontend directory:
            <pre><code>cd client</code></pre>
        </li>
        <li>Install frontend dependencies:
            <pre><code>npm install</code></pre>
        </li>
        <li>Start the React application:
            <pre><code>npm start</code></pre>
        </li>
    </ol>

    <h3>Multer Configuration for File Upload</h3>
    <p>
        Employees can upload their resumes and certificates, which are saved on the server using <strong>Multer</strong>. 
        The uploaded files are stored in the <code>uploads/documents</code> directory. 
        Make sure the server has permission to write to the designated upload directory.
    </p>

    <h2>API Endpoints</h2>

    <h3>Employee Routes</h3>
    <ul>
        <li><code>POST /employe/signup</code>: Employee signup.</li>
        <li><code>POST /employe/login</code>: Employee login.</li>
        <li><code>GET /employe/profile</code>: Fetch employee profile data.</li>
        <li><code>POST /employe/attendance</code>: Mark attendance (Geofencing check required).</li>
        <li><code>POST /employe/leave/apply</code>: Apply for leave.</li>
        <li><code>POST /employe/upload</code>: Upload resume or certificate (via <strong>Multer</strong>).</li>
    </ul>

    <h3>Manager Routes</h3>
    <ul>
        <li><code>POST /manager/signup</code>: Manager signup.</li>
        <li><code>POST /manager/login</code>: Manager login.</li>
        <li><code>GET /manager/employees</code>: Fetch employees assigned to the manager.</li>
        <li><code>POST /manager/review</code>: Submit performance reviews for employees.</li>
        <li><code>POST /manager/leave/approve</code>: Approve/reject leave applications.</li>
    </ul>

    <h2>Geofencing Logic</h2>
    <p>
        Geofencing is implemented to ensure that employees can only mark attendance if they are within a 100-meter radius of the manager's predefined coordinates. 
        This improves the accuracy and accountability of the attendance system.
    </p>

    <h2>State Management (Redux)</h2>
    <p>
        <strong>Redux</strong> is used to manage the state of the application, handling authentication, profile management, attendance status, leave applications, and manager actions in a streamlined manner.
    </p>

    <h2>Screenshots</h2>
    <p>Include screenshots of the application’s main features here (optional but recommended).</p>

    <h2>License</h2>
    <p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>
