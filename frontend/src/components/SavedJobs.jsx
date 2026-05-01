import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import { useSelector } from 'react-redux'
import { Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
import useGetAllJobs from '@/hooks/useGetAllJobs'

const SavedJobs = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const [savedIds, setSavedIds] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
        setSavedIds(stored);

        const handleStorageChange = () => {
            const updated = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
            setSavedIds(updated);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const savedJobs = allJobs.filter(job => savedIds.includes(job._id));

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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{savedJobs.length} job{savedJobs.length !== 1 ? 's' : ''} saved</p>
                        </div>
                    </div>
                </motion.div>

                {savedJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24"
                    >
                        <div className="text-7xl mb-5">🔖</div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No saved jobs yet</h3>
                        <p className="text-gray-400 mb-6">Browse jobs and click the bookmark icon to save them here.</p>
                        <a
                            href="/jobs"
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            Browse Jobs
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {savedJobs.map((job, index) => (
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
