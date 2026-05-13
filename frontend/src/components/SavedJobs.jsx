import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import { Bookmark, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import useGetSavedJobs from '@/hooks/useGetSavedJobs'
import { Link } from 'react-router-dom'

const SavedJobs = () => {
    useGetSavedJobs(); // Ensure fresh data
    const { savedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    // Map savedJob metadata to the format expected by the Job component
    const displayJobs = (savedJobs || []).map(sj => ({
        _id: sj.jobId,
        title: sj.title,
        description: "", // Metadata usually enough for the card
        location: sj.location,
        jobType: sj.jobType,
        salary: sj.salary,
        source: sj.platform,
        isExternal: sj.jobId.startsWith('ext_'),
        applyUrl: sj.applyUrl,
        createdAt: sj.savedAt, // Use saved date for "days ago"
        company: {
            name: sj.company,
            logo: sj.logo
        }
    }));

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4">
                <Bookmark className="w-16 h-16 text-gray-300 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Please login to see your saved jobs</h1>
                <Link to="/login" className="mt-4 text-[#6A38C2] font-semibold hover:underline">Login Now</Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#6A38C2]/10 flex items-center justify-center">
                            <Bookmark className="w-5 h-5 text-[#6A38C2]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Saved Jobs</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {displayJobs.length} job{displayJobs.length !== 1 ? 's' : ''} saved to your account
                            </p>
                        </div>
                    </div>
                </motion.div>

                {displayJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10"
                    >
                        <div className="text-7xl mb-5">🔖</div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No saved jobs yet</h3>
                        <p className="text-gray-400 mb-6">Browse jobs and click the bookmark icon to save them to your account.</p>
                        <Link
                            to="/jobs"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            Browse All Jobs
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {displayJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.07 }}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavedJobs
