import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '../models/User.js';
import { HealthDetails } from '../models/HealthDetails.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import { uploadFile } from '../services/ipfsService.js'; // Importing the IPFS service
import { Doctor } from '../models/Doctor.js'; // Import the Doctor model
import { exec } from 'child_process';
// Import necessary libraries
import { ThirdwebStorage } from "@thirdweb-dev/storage"; // Ensure you are using ES module syntax

import https from 'https'; // Importing the https module
import { ThirdwebSDK } from '@thirdweb-dev/sdk'; // Import Thirdweb SDK
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const router = express.Router();

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sdk = new ThirdwebSDK("mumbai", { 
   clientId: process.env.THIRDWEB_API_KEY,
    secretKey: process.env.THIRDWEB_API_SECRETE,
    storage: {
      gatewayUrls: [`https://${process.env.THIRDWEB_API_KEY}.ipfscdn.io/ipfs/`,
      "https://cloudflare-ipfs.com/ipfs/",
      "https://ipfs.io/ipfs/"], // Custom gateway URL
    },
 });
console.log("THIRDWEB_API_KEY:", process.env.THIRDWEB_API_KEY); // Make sure this is not exposed in production logs

// Use memory storage to hold file buffer
const storage = new ThirdwebStorage({
    uploader: sdk.storage.uploader, // Use the SDK's uploader for seamless integration
    gatewayUrls: [
      `https://${process.env.THIRDWEB_API_KEY}.ipfscdn.io/ipfs/`,
      "https://cloudflare-ipfs.com/ipfs/",
      "https://ipfs.io/ipfs/"
    ]});const upload = multer();

// Sign-up route
router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashPassword,
            role: role || 'user'
        });

        await newUser.save();
        return res.status(200).json({ status: true, redirect: "/login", message: "Record registered" });
    } catch (error) {
        console.error('Error during sign-up:', error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, maxAge: 3600000,sameSite: 'Lax',secure: process.env.NODE_ENV === 'production'  }); // 1 hour
        return res.json({ status: true, message: "Login successful" });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Forgot password route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not registered" });
        }
        const token = jwt.sign({ id: user._id }, process.env.KEY, { expiresIn: '5m' });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Password',
            text: `http://localhost:3000/resetpassword/${token}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                return res.json({ status: true, message: 'Email sent' });
            }
        });

    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ message: 'Error processing request' });
    }
});

// Reset password route
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.KEY);
        const id = decoded.id;
        const hashPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashPassword });
        return res.json({ status: true, message: "Password updated successfully" });
    } catch (error) {
        console.error('Error verifying token or updating password:', error);
        return res.status(400).json({ message: 'Invalid or expired token' });
    }
});

// Middleware to verify user
const verifyUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ status: false, message: "No token" });
        }

        const decoded = jwt.verify(token, process.env.KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        req.user = user; // Attach user to the request object
        next();
    } catch (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ status: false, message: "Invalid token" });
    }
};

// Dashboard verify route
router.get('/verify', verifyUser, (req, res) => {
    const isDoctor = req.user.role === 'doctor';
    return res.json({ status: true, isDoctor, message: "Authorized" });
});

// Logout route
router.post('/logout', (req, res) => {
    try {
        res.clearCookie('token');
        return res.json({ status: true, message: "Logout successful" });
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: "Server error" });
    }
});



// Upload health details route (only for authenticated users)


// Inside your upload health details route
// Add verifyUser as middleware to ensure the user is authenticated
// Upload health details route
// Upload health details route (only for authenticated users)
router.post('/upload-health-details', verifyUser, upload.single('fullBodyReport'), async (req, res) => {
    const token = req.headers['authorization'];
    console.log('Received token:', token);
    try {
        const { name, age, location, bloodGroup, smoker, drinker } = req.body;
        const fileBuffer = req.file.buffer;

        // Upload file to IPFS
        const ipfsUrl = await storage.upload(fileBuffer);

        // Save details in MongoDB
        const healthDetails = new HealthDetails({
            userId: req.user._id,
            name,
            age,
            location,
            bloodGroup,
            smoker: smoker === 'yes',
            drinker: drinker === 'yes',
            fullBodyReport: req.file.originalname,
            ipfsHash: ipfsUrl // Save the IPFS URL
        });

        await healthDetails.save();
        res.json({ status: true, message: "Health details uploaded successfully" });
    } catch (error) {
        console.error('Error uploading health details:', error);
        res.status(500).json({ status: false, message: "Failed to upload health details" });
    }
});


  router.post('/verify-doctor', async (req, res) => {
    const { doctorId } = req.body;

    try {
        // Check if the doctor exists
        const doctor = await Doctor.findOne({ doctorId });

        if (!doctor) {
            return res.status(404).json({ status: false, message: 'Doctor not found' });
        }

        // If doctor is found, return success
        return res.json({ status: true, message: 'Doctor verified' });
    } catch (error) {
        console.error('Error verifying doctor:', error);
        return res.status(500).json({ status: false, message: 'Server error' });
    }
});// Fetch all patients for dashboard view
router.get('/patients', verifyUser, async (req, res) => {
    try {
        const patients = await HealthDetails.find().select('userId name age location bloodGroup smoker drinker');
        return res.json(patients || []); // Ensure an array is returned
    } catch (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ message: "Server error" });
    }
});


// Fetch specific patient details, including fullBodyReport
router.get('/patients/:id', verifyUser, async (req, res) => {
    try {
        const patient = await HealthDetails.findById(req.params.id).populate('userId', 'name age bloodGroup');
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        return res.json(patient);
    } catch (error) {
        console.error('Error fetching patient details:', error);
        return res.status(500).json({ message: "Server error" });
    }
});

// Upload a new health report to IPFS
// Upload a new health report
// Upload a new health report
router.post('/patients/:id/reports', verifyUser, upload.single('report'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: false, message: "No report file provided." });
        }

        const ipfsUrl = await uploadFile(req.file.buffer);
        await HealthDetails.findByIdAndUpdate(req.params.id, { fullBodyReport: ipfsUrl });
        return res.json({ status: true, message: "Report uploaded successfully.", ipfsUrl });
    } catch (error) {
        console.error('Error uploading report:', error);
        return res.status(500).json({ status: false, message: "Server error while uploading report." });
    }
});



export { router as UserRouter };
