import React, { useEffect, useMemo, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { JobSkeletonGrid } from './shared/JobSkeleton';

const Jobs = () => {
    useGetAllJobs();

    // Safe defaults — filters may be undefined if old persisted state loaded
    const allJobs = useSelector(store => store.job.allJobs) || [];
    const searchedQuery = useSelector(store => store.job.searchedQuery) || '';
    const isLoading = useSelector(store => store.job.isLoading) || false;
    const filters = useSelector(store => store.job.filters) || {};

    const [showFilter, setShowFilter] = useState(false);

    // Apply all active filters client-side with AND logic
    const filterJobs = useMemo(() => {
        let jobs = [...allJobs];

        if (searchedQuery) {
            const q = searchedQuery.toLowerCase();
            jobs = jobs.filter(job =>
                job?.title?.toLowerCase().includes(q) ||
                job?.description?.toLowerCase().includes(q) ||
                job?.location?.toLowerCase().includes(q) ||
                job?.jobType?.toLowerCase().includes(q) ||
                job?.source?.toLowerCase().includes(q)
            );
        }

        if (filters.location) {
            const loc = filters.location.toLowerCase();
            jobs = jobs.filter(job => job?.location?.toLowerCase().includes(loc));
        }

        if (filters.role) {
            const role = filters.role.toLowerCase();
            jobs = jobs.filter(job =>
                job?.title?.toLowerCase().includes(role) ||
                job?.description?.toLowerCase().includes(role)
            );
        }

        if (filters.jobType) {
            jobs = jobs.filter(job =>
                job?.jobType?.toLowerCase() === filters.jobType.toLowerCase()
            );
        }

        if (filters.workMode) {
            jobs = jobs.filter(job =>
                job?.workMode?.toLowerCase() === filters.workMode.toLowerCase()
            );
        }

        if (filters.source) {
            const src = filters.source.toLowerCase();
            jobs = jobs.filter(job =>
                job?.source?.toLowerCase() === src ||
                (!job?.source && src === 'internal')
            );
        }

        return jobs;
    }, [allJobs, searchedQuery, filters]);

    const activeFilterCount = Object.values(filters).filter(v => v).length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-8'>

                {/* Page Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Jobs</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isLoading
                                ? 'Loading opportunities...'
                                : `${filterJobs.length} opportunit${filterJobs.length !== 1 ? 'ies' : 'y'} found`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilter(!showFilter)}
                        className="md:hidden flex items-center gap-2 bg-[#6A38C2]/10 text-[#6A38C2] px-4 py-2 rounded-xl text-sm font-semibold"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-[#6A38C2] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                {activeFilterCount}
                            </span>
                        )}
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
                        {isLoading ? (
                            <JobSkeletonGrid count={6} />
                        ) : filterJobs.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-24"
                            >
                                <div className="text-7xl mb-5">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Jobs Found</h3>
                                <p className="text-gray-400 text-sm">Try adjusting your filters or search terms.</p>
                            </motion.div>
                        ) : (
                            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5'>
                                <AnimatePresence>
                                    {filterJobs.map((job, index) => (
                                        <motion.div
                                            key={job?._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
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
    );
}

export default Jobs