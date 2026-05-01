import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal, Calendar, Building2, Briefcase } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredJobs = allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    }, [allAdminJobs, searchJobByText])

    return (
        <div className="overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your recently posted jobs</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company Name</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Posted</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {
                            filterJobs?.map((job, index) => (
                                <motion.tr
                                    key={job._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-[#6A38C2]/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Building2 className='w-4 h-4 text-[#6A38C2]' />
                                            <span className='font-semibold text-gray-900 dark:text-white text-sm'>{job?.company?.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Briefcase className='w-4 h-4 text-[#8B5CF6]' />
                                            <span className='text-gray-700 dark:text-gray-300 text-sm'>{job?.title}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='w-3.5 h-3.5' />
                                            {job?.createdAt.split("T")[0]}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-40 p-2 rounded-xl border-gray-100 dark:border-white/10 shadow-2xl">
                                                <div className='flex flex-col gap-1'>
                                                    <button
                                                        onClick={() => navigate(`/admin/companies/${job._id}`)}
                                                        className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium transition-colors'
                                                    >
                                                        <Edit2 className='w-4 h-4 text-[#6A38C2]' />
                                                        <span>Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                        className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium transition-colors'
                                                    >
                                                        <Eye className='w-4 h-4 text-[#8B5CF6]' />
                                                        <span>Applicants</span>
                                                    </button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </motion.tr>

                            ))
                        }
                    </AnimatePresence>
                </TableBody>
            </Table>
            {filterJobs?.length === 0 && (
                <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
                    No jobs found matching your search.
                </div>
            )}
        </div>
    )
}

export default AdminJobsTable