import mongoose from 'mongoose';

const healthDetailsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    smoker: { type: Boolean, required: true },
    drinker: { type: Boolean, required: true },
    fullBodyReport: { type: String, required: true },
    ipfsHash: { type: String, required: true }  // Store IPFS URL here
}, { timestamps: true });

const HealthDetails = mongoose.model('HealthDetails', healthDetailsSchema);
export { HealthDetails };
