import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-between mb-10"
            >
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        <span className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent">Latest & Top </span>
                        Job Openings
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">Hand-picked opportunities from top companies</p>
                </div>
                <div className="hidden md:flex items-center gap-2 bg-[#6A38C2]/10 text-[#6A38C2] px-4 py-2 rounded-full text-sm font-semibold">
                    <Briefcase className="w-4 h-4" />
                    {allJobs.length} Jobs Available
                </div>
            </motion.div>

            {allJobs.length === 0 ? (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Jobs Available Yet</h3>
                    <p className="text-gray-400">Check back soon — new opportunities are posted daily!</p>
                </div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                    {allJobs.slice(0, 6).map((job, index) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.08 }}
                        >
                            <LatestJobCards job={job} />
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default LatestJobs