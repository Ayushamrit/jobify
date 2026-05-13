import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const Jobs = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);

    useEffect(() => {
        if (searchedQuery) {
            const query = searchedQuery.toLowerCase();
            const filteredJobs = (allJobs || []).filter((job) => {
                // Location match
                const locationMatch = job?.location?.toLowerCase().includes(query);
                // Title/Role match
                const titleMatch = job?.title?.toLowerCase().includes(query);
                // Description match
                const descMatch = job?.description?.toLowerCase().includes(query);
                // Job Type match
                const typeMatch = job?.jobType?.toLowerCase().includes(query);
                // Source match
                const sourceMatch = job?.source?.toLowerCase().includes(query);
                
                // Salary Range Match logic
                let salaryMatch = false;
                const salaryVal = parseFloat(job?.salary);
                if (query === "0-40k") salaryMatch = salaryVal <= 40000;
                else if (query === "40k-1l") salaryMatch = salaryVal > 40000 && salaryVal <= 100000;
                else if (query === "1l-5l") salaryMatch = salaryVal > 100000 && salaryVal <= 500000;
                else if (query === "5l+") salaryMatch = salaryVal > 500000;
                else salaryMatch = job?.salary?.toString().toLowerCase().includes(query);

                return locationMatch || titleMatch || descMatch || typeMatch || sourceMatch || salaryMatch;
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs || []);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-10'>
                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Filter Section */}
                    <div className='w-full lg:w-1/4 shrink-0'>
                        <div className="sticky top-24">
                            <FilterCard />
                        </div>
                    </div>

                    {/* Jobs List Section */}
                    <div className='flex-1'>
                        <div className="mb-6 flex items-center justify-between">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {filterJobs.length} {filterJobs.length === 1 ? 'Opportunity' : 'Opportunities'} found
                            </h1>
                        </div>

                        {filterJobs.length <= 0 ? (
                            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10">
                                <div className="text-7xl mb-5">🔍</div>
                                <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No jobs found</h3>
                                <p className="text-gray-400">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                                {filterJobs.map((job) => (
                                    <motion.div
                                        key={job?._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Jobs