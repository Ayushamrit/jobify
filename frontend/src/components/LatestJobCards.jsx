import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const sourceStyles = {
    'Unstop':      { bg: 'bg-orange-100 text-orange-600 border-orange-200', label: '🟠 Unstop' },
    'Naukri':      { bg: 'bg-blue-100 text-blue-600 border-blue-200',       label: '🔵 Naukri' },
    'JSearch':     { bg: 'bg-sky-100 text-sky-600 border-sky-200',          label: '🔷 JSearch' },
    'Arbeitnow':   { bg: 'bg-green-100 text-green-600 border-green-200',    label: '🟢 Arbeitnow' },
    'Active Jobs': { bg: 'bg-indigo-100 text-indigo-600 border-indigo-200', label: '🔹 Active Jobs' },
};

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    const daysAgo = (mongodbTime) => {
        const diff = new Date() - new Date(mongodbTime);
        return Math.floor(diff / (1000 * 24 * 60 * 60));
    }
    const days = daysAgo(job?.createdAt);
    const isNew = days === 0;
    const isExternal = job?.isExternal;
    const src = sourceStyles[job?.source] || null;

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={() => navigate(`/description/${job._id}`)}
            className="job-card p-5 group flex flex-col h-full"
        >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${isNew ? 'text-green-600' : 'text-gray-400'}`}>
                        <Clock className="w-3 h-3" />
                        {isNew ? 'Today' : `${days}d ago`}
                    </span>
                    {isExternal && src && (
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${src.bg}`}>
                            {src.label}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6A38C2]/10 to-[#8B5CF6]/10 border border-[#6A38C2]/20 flex items-center justify-center font-bold text-[#6A38C2] text-lg shrink-0 overflow-hidden">
                    {job?.company?.logo
                        ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-1" />
                        : job?.company?.name?.[0]?.toUpperCase()
                    }
                </div>
                <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{job?.company?.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job?.location || 'Remote'}
                    </p>
                </div>
            </div>

            {/* Title & Description */}
            <h2 className="font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-[#6A38C2] dark:group-hover:text-[#8B5CF6] transition-colors">
                {job?.title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{job?.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="badge-indigo flex items-center gap-1">
                    <Briefcase className="w-3 h-3" />{job?.position} Positions
                </span>
                <span className="badge-coral">{job?.jobType}</span>
                <span className="badge-purple">
                    {isNaN(job?.salary) ? job?.salary : `₹${job?.salary} LPA`}
                </span>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-1 text-xs font-semibold text-[#6A38C2] dark:text-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-y-1 group-hover:translate-y-0">
                View Details <ArrowRight className="w-3 h-3" />
            </div>
        </motion.div>
    )
}

export default LatestJobCards