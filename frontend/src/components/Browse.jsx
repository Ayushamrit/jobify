import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-[#6A38C2]/10 flex items-center justify-center">
                            <Search className="w-5 h-5 text-[#6A38C2]" />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Search Results</h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{allJobs.length} jobs found</p>
                        </div>
                    </div>
                </motion.div>

                {allJobs.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-7xl mb-5">🔍</div>
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No jobs found</h3>
                        <p className="text-gray-400">Try a different search term or browse all jobs.</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                        {allJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.06 }}
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

export default Browse