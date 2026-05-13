import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [showFilter, setShowFilter] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                const query = searchedQuery.toLowerCase();
                return job?.title?.toLowerCase().includes(query) ||
                    job?.description?.toLowerCase().includes(query) ||
                    job?.location?.toLowerCase().includes(query) ||
                    job?.jobType?.toLowerCase().includes(query) ||
                    job?.workMode?.toLowerCase().includes(query) ||
                    job?.source?.toLowerCase().includes(query) || // Search by source portal
                    job?.salary?.toString().includes(query);
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-8'>

                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            All Jobs
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {filterJobs.length} opportunit{filterJobs.length !== 1 ? 'ies' : 'y'} found
                        </p>
                    </div>
                    {/* Mobile filter toggle */}
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="md:hidden flex items-center gap-2 bg-[#6A38C2]/10 text-[#6A38C2] px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                        <SlidersHorizontal className="w-4 h-4" /> Filters
                    </button>
                </div>

                <div className='flex gap-6'>
                    {/* Filter Sidebar */}
                    <aside className={`${showFilter ? 'block' : 'hidden'} md:block w-full md:w-72 shrink-0`}>
                        <div className="sticky top-24">
                            <FilterCard />
                        </div>
                    </aside>

                    {/* Jobs Grid */}
                    <div className="flex-1">
                        {filterJobs.length === 0 ? (
                            <div className="text-center py-24">
                                <div className="text-7xl mb-5">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Jobs Found</h3>
                                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                                <AnimatePresence>
                                    {filterJobs.map((job, index) => (
                                        <motion.div
                                            key={job?._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs