import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useSelector } from 'react-redux'
import { CheckCircle2, Clock, XCircle, Briefcase, Edit3, StickyNote } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'

const statusConfig = {
    pending: {
        label: 'Pending',
        icon: <Clock className="w-3 h-3" />,
        className: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/30',
    },
    applied: {
        label: 'Applied',
        icon: <Briefcase className="w-3 h-3" />,
        className: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700/30',
    },
    shortlisted: {
        label: 'Shortlisted',
        icon: <CheckCircle2 className="w-3 h-3" />,
        className: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700/30',
    },
    accepted: {
        label: 'Accepted',
        icon: <CheckCircle2 className="w-3 h-3" />,
        className: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/30',
    },
    rejected: {
        label: 'Rejected',
        icon: <XCircle className="w-3 h-3" />,
        className: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-700/30',
    },
};

const StatusBadge = ({ status }) => {
    const s = status?.toLowerCase() || 'applied';
    const config = statusConfig[s] || statusConfig.applied;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.className}`}>
            {config.icon}
            {config.label}
        </span>
    );
};

import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setAllAppliedJobs } from '@/redux/jobSlice'

const AppliedJobTable = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();

    const handleStatusUpdate = async (id, newStatus, newNotes) => {
        try {
            const body = {};
            if (newStatus) body.status = newStatus;
            if (newNotes !== undefined) body.notes = newNotes;

            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, body, { withCredentials: true });
            if (res.data.success) {
                toast.success(newNotes !== undefined ? "Notes saved!" : "Status updated!");
                // Update local state
                const updatedJobs = allAppliedJobs.map(job => 
                    job._id === id ? { ...job, ...(newStatus && {status: newStatus}), ...(newNotes !== undefined && {notes: newNotes}) } : job
                );
                dispatch(setAllAppliedJobs(updatedJobs));
            }
        } catch (error) {
            toast.error("Failed to update application");
        }
    };

    if (allAppliedJobs.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl mb-3">📋</div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">You haven't applied to any jobs yet.</p>
                <a href="/jobs" className="inline-block mt-4 text-sm text-[#6A38C2] font-semibold hover:underline">
                    Browse Jobs →
                </a>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-white/10">
            <Table>
                <TableCaption className="text-xs text-gray-400 pb-4">
                    {allAppliedJobs.length} application{allAppliedJobs.length !== 1 ? 's' : ''} total
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Role</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Company</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.map((appliedJob) => {
                        const isExternal = appliedJob.isExternal;
                        const jobData = isExternal ? appliedJob.externalJobDetails : appliedJob.job;

                        return (
                            <TableRow
                                key={appliedJob._id}
                                className="hover:bg-[#6A38C2]/5 dark:hover:bg-white/5 transition-colors"
                            >
                                <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                    {appliedJob?.createdAt?.split("T")[0]}
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900 dark:text-white text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center p-1 overflow-hidden shrink-0">
                                            {jobData?.logo 
                                                ? <img src={jobData.logo} alt="" className="w-full h-full object-contain" />
                                                : <Briefcase className="w-3.5 h-3.5 text-[#6A38C2]" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate">{jobData?.title}</p>
                                            {isExternal && (
                                                <span className="text-[10px] text-orange-500 font-bold uppercase">{jobData.source}</span>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                                    {isExternal ? jobData?.company : jobData?.company?.name}
                                </TableCell>
                                <TableCell>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#6A38C2] transition-colors group">
                                                <StickyNote className="w-3.5 h-3.5" />
                                                <span className="max-w-[100px] truncate">{appliedJob.notes || 'Add notes...'}</span>
                                                <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-72 p-4 bg-white dark:bg-gray-900 border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl">
                                            <h4 className="text-sm font-bold mb-2 flex items-center gap-2">
                                                <Edit3 className="w-4 h-4 text-[#6A38C2]" /> Application Notes
                                            </h4>
                                            <textarea 
                                                className="w-full h-24 p-3 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-[#6A38C2] transition-all"
                                                placeholder="Interview date, HR contact, follow-up status..."
                                                defaultValue={appliedJob.notes}
                                                onBlur={(e) => handleStatusUpdate(appliedJob._id, null, e.target.value)}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-2 italic">Notes are saved automatically on blur.</p>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                                <TableCell className="text-right">
                                    {isExternal ? (
                                        <select 
                                            value={appliedJob.status}
                                            onChange={(e) => handleStatusUpdate(appliedJob._id, e.target.value)}
                                            className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 outline-none border cursor-pointer transition-colors ${
                                                statusConfig[appliedJob.status.toLowerCase()]?.className || statusConfig.applied.className
                                            }`}
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Accepted">Selected</option>
                                        </select>
                                    ) : (
                                        <StatusBadge status={appliedJob.status} />
                                    )}
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable