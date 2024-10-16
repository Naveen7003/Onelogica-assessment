const multer = require('multer');
const path = require('path');

//storage for uploaded documents
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents/'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        // Save the file with its original name
        cb(null, `${Date.now()}-${file.originalname}`); // To avoid filename collisions
    }
});

// Initialize Multer with the defined storage
const upload = multer({ storage });

module.exports = upload;
