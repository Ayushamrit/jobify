const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../backend/.env' });

const JobSchema = new mongoose.Schema({}, { strict: false });
const Job = mongoose.model('Job', JobSchema);

const checkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        const jobs = await Job.find({});
        console.log(`Total jobs found: ${jobs.length}`);
        if (jobs.length > 0) {
            console.log('Sample job title:', jobs[0].title);
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

checkJobs();
