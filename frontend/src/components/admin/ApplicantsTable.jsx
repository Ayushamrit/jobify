import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Mail, Phone, FileText, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const shortlistingStatus = ["Shortlisted", "Interviewing", "Selected", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of users who applied for this job</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resume</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cover Letter</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Applied</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {
                            applicants && applicants?.applications?.map((item, index) => (
                                <motion.tr
                                    key={item._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-[#6A38C2]/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <TableCell className="font-semibold text-gray-900 dark:text-white text-sm">
                                        {item?.applicant?.fullname}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            <Mail className='w-3.5 h-3.5 text-[#6A38C2]' />
                                            {item?.applicant?.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            <Phone className='w-3.5 h-3.5 text-[#6A38C2]' />
                                            {item?.applicant?.phoneNumber}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item.applicant?.profile?.resume ? (
                                                <a 
                                                    className="inline-flex items-center gap-2 text-[#6A38C2] hover:underline font-medium text-sm" 
                                                    href={item?.applicant?.profile?.resume} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    <FileText className='w-4 h-4' />
                                                    {item?.applicant?.profile?.resumeOriginalName || "View Resume"}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">Not Available</span>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {
                                            item?.coverLetter ? (
                                                <Popover>
                                                    <PopoverTrigger className="text-[#6A38C2] text-sm hover:underline font-medium">View</PopoverTrigger>
                                                    <PopoverContent className="w-80 p-4 rounded-xl border-gray-100 dark:border-white/10 shadow-2xl text-sm text-gray-700 dark:text-gray-300">
                                                        {item.coverLetter}
                                                    </PopoverContent>
                                                </Popover>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">None</span>
                                            )
                                        }
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='w-3.5 h-3.5' />
                                            {item?.applicant.createdAt.split("T")[0]}
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
                                                    {shortlistingStatus.map((status, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={() => statusHandler(status, item?._id)}
                                                            className={`flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium transition-colors ${
                                                                status === "Selected" ? "text-green-600" : status === "Rejected" ? "text-red-600" : "text-blue-600"
                                                            }`}
                                                        >
                                                            <span>{status}</span>
                                                        </button>
                                                    ))}
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
            {(!applicants || applicants?.applications?.length === 0) && (
                <div className='text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10'>
                    <div className='text-4xl mb-4'>👥</div>
                    <h3 className='font-bold text-gray-900 dark:text-white'>No applicants yet</h3>
                    <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>Applications will appear here once users apply for this job.</p>
                </div>
            )}
        </div>
    )
}

export default ApplicantsTable