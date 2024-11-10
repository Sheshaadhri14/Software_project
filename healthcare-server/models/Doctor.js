import mongoose from 'mongoose';

const DoctorSchema = new mongoose.Schema({
    doctorId: { type: String, required: true, unique: true }, // Unique identifier for the doctor
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    phone: { type: String, required: true },
    // Add any other necessary fields
}, { timestamps: true });

export const Doctor = mongoose.model('Doctor', DoctorSchema);
