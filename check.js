import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const jobSchema = new mongoose.Schema({
    company: String,
    role: String,
    status: String,
    createdAt: Date
}, { collection: 'jobs' });

const Job = mongoose.model('Job', jobSchema);

async function check() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB.');

        const lastJobs = await Job.find().sort({ createdAt: -1 }).limit(3);

        if (lastJobs.length === 0) {
            console.log('No entries found in the "jobs" collection yet.');
        } else {
            console.log('Last 3 entries in "jobs" collection:');
            lastJobs.forEach((job, index) => {
                console.log(`${index + 1}. [${job.company}] ${job.role} - Status: ${job.status} (Created: ${job.createdAt})`);
            });
        }

        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (error) {
        console.error('Error during verification:', error);
    }
}

check();
