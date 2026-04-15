import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB: canva_user database'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema
const jobSchema = new mongoose.Schema({
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: String,
    salary: String,
    status: {
        type: String,
        enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'],
        default: 'wishlist'
    },
    url: String,
    notes: String,
    appliedDate: String,
    id: String // Keeping the frontend generated ID as well
}, { collection: 'jobs', timestamps: true });

const Job = mongoose.model('Job', jobSchema);

// API Routes
app.post('/api/save', async (req, res) => {
    console.log('Incoming POST /api/save request body:', req.body);
    try {
        const newJob = new Job(req.body);
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);
    } catch (error) {
        console.error('Error saving job:', error);
        res.status(500).json({ message: 'Error saving job data', error: error.message });
    }
});

app.get('/api/jobs', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
});

// Update route (for status changes or edits)
app.put('/api/jobs/:id', async (req, res) => {
    try {
        // We might use the schema's 'id' or '_id'. The frontend uses 'id'.
        const updatedJob = await Job.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
});

// Delete route
app.delete('/api/jobs/:id', async (req, res) => {
    try {
        await Job.findOneAndDelete({ id: req.params.id });
        res.json({ message: 'Job deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting job', error: error.message });
    }
});

// Catch-all route for Express 5.0
app.get(/^(?!\/api).+/, (req, res) => {
    res.status(404).json({ message: 'Route not found or handled by frontend' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
