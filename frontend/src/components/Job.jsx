import React, { useState } from 'react'
import { Button } from './ui/button'
import { Bookmark, BookmarkCheck, MapPin, Clock, Briefcase, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

const sourceStyles = {
    'Unstop': { bg: 'bg-orange-100 text-orange-600 border-orange-200', label: '🟠 Unstop' },
    'Naukri': { bg: 'bg-blue-100 text-blue-600 border-blue-200', label: '🔵 Naukri' },
    'JSearch': { bg: 'bg-sky-100 text-sky-600 border-sky-200', label: '🔷 JSearch' },
    'Arbeitnow': { bg: 'bg-green-100 text-green-600 border-green-200', label: '🟢 Arbeitnow' },
    'Active Jobs': { bg: 'bg-indigo-100 text-indigo-600 border-indigo-200', label: '🔹 Active Jobs' },
};

const Job = ({ job }) => {
    const navigate = useNavigate();

    const daysAgoFunction = (mongodbTime) => {
        const diff = new Date() - new Date(mongodbTime);
        return Math.floor(diff / (1000 * 24 * 60 * 60));
    };
    const days = daysAgoFunction(job?.createdAt);
    const isNew = days === 0;
    const isExternal = job?.isExternal;
    const src = sourceStyles[job?.source] || null;

    const formatSalary = (salary) => {
        if (!salary || salary === 'N/A') return null;
        const num = Number(salary);
        if (!isNaN(num) && num > 0) return `₹${num} LPA`;
        return salary;
    };
    const salaryDisplay = formatSalary(job?.salary);

    const [saved, setSaved] = useState(() => {
        const bookmarks = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
        return bookmarks.includes(job?._id);
    });

    const toggleSave = (e) => {
        e.stopPropagation();
        const bookmarks = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
        let updated;
        if (saved) {
            updated = bookmarks.filter(id => id !== job?._id);
            toast.success('Job removed from saved');
        } else {
            updated = [...bookmarks, job?._id];
            toast.success('Job saved!');
        }
        localStorage.setItem('jobify-saved', JSON.stringify(updated));
        setSaved(!saved);
    };

    const handleViewDetails = () => {
        if (isExternal && job?.applyUrl) {
            window.open(job.applyUrl, '_blank');
        } else {
            navigate(`/description/${job?._id}`);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="job-card p-5 group"
        >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-medium flex items-center gap-1 ${isNew ? 'text-green-600' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        {isNew ? 'Today' : `${days}d ago`}
                    </span>
                    {isExternal && src && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${src.bg}`}>
                            {src.label}
                        </span>
                    )}
                </div>
                <button
                    onClick={toggleSave}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${saved
                            ? 'bg-[#6A38C2]/10 text-[#6A38C2]'
                            : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-[#6A38C2] hover:bg-[#6A38C2]/10'
                        }`}
                >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
            </div>

            {/* Company */}
            <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#6A38C2]/10 to-[#8B5CF6]/10 border border-[#6A38C2]/20 flex items-center justify-center overflow-hidden shrink-0">
                    {job?.company?.logo
                        ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-1" onError={e => e.target.style.display = 'none'} />
                        : <span className="font-bold text-[#6A38C2]">{job?.company?.name?.[0]?.toUpperCase()}</span>
                    }
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{job?.company?.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" /> {job?.location || 'Remote'}
                    </p>
                </div>
                {isNew && (
                    <span className="ml-auto shrink-0 text-xs font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">New</span>
                )}
            </div>

            {/* Title & Description */}
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-[#6A38C2] dark:group-hover:text-[#8B5CF6] transition-colors line-clamp-1">
                {job?.title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{job?.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
                {job?.position > 0 && (
                    <span className="badge-indigo flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {job.position} Pos.
                    </span>
                )}
                {job?.jobType && <span className="badge-coral">{job.jobType}</span>}
                {salaryDisplay && <span className="badge-purple">{salaryDisplay}</span>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
                <Button
                    onClick={handleViewDetails}
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl border-[#6A38C2]/30 text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all duration-200 font-semibold"
                >
                    {isExternal ? <><ExternalLink className="w-3 h-3 mr-1.5" />Apply</> : 'View Details'}
                </Button>
                <Button
                    onClick={toggleSave}
                    size="sm"
                    className={`rounded-xl font-semibold transition-all duration-200 ${saved
                            ? 'bg-[#6A38C2] text-white hover:bg-[#5b30a6]'
                            : 'bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white hover:from-[#5b30a6] hover:to-[#7C3AED]'
                        }`}
                >
                    {saved ? 'Saved ✓' : 'Save'}
                </Button>
            </div>
        </motion.div>
    )
}

export default Job