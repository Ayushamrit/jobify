import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { MapPin, Briefcase, Clock, DollarSign, Users, Calendar, CheckCircle2, ArrowLeft, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './shared/Navbar';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const isInitiallyApplied = singleJob?.applications?.some(a => a.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [saved, setSaved] = useState(() => {
        const bookmarks = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
        return bookmarks.includes(singleJob?._id);
    });

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [coverLetter, setCoverLetter] = useState("");

    const isExternalJob = singleJob?._id?.startsWith('ext_');

    const formatSalary = (salary) => {
        if (!salary || salary === 'N/A') return 'N/A';
        if (isNaN(Number(salary))) return salary;
        return `₹${salary} LPA`;
    };

    const applyJobHandler = async () => {
        if (isExternalJob) {
            if (singleJob?.applyUrl) {
                window.open(singleJob.applyUrl, '_blank');
            }
            return;
        }
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { coverLetter }, { withCredentials: true });
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...(singleJob.applications || []), { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying for job");
        }
    }

    const toggleSave = () => {
        const bookmarks = JSON.parse(localStorage.getItem('jobify-saved') || '[]');
        let updated;
        if (saved) {
            updated = bookmarks.filter(id => id !== singleJob?._id);
            toast.success('Job removed from saved');
        } else {
            updated = [...bookmarks, singleJob?._id];
            toast.success('Job saved!');
        }
        localStorage.setItem('jobify-saved', JSON.stringify(updated));
        setSaved(!saved);
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications?.some(a => a.applicant === user?._id) || false);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    const details = [
        { icon: <MapPin className="w-4 h-4" />, label: 'Location', value: singleJob?.location },
        { icon: <Briefcase className="w-4 h-4" />, label: 'Job Type', value: singleJob?.jobType },
        { icon: <DollarSign className="w-4 h-4" />, label: 'Salary', value: formatSalary(singleJob?.salary) },
        { icon: <Clock className="w-4 h-4" />, label: 'Experience', value: singleJob?.experienceLevel ? `${singleJob.experienceLevel} yrs` : undefined },
        { icon: <Users className="w-4 h-4" />, label: 'Openings', value: singleJob?.position ? `${singleJob.position} Positions` : undefined },
        { icon: <Calendar className="w-4 h-4" />, label: 'Posted', value: singleJob?.createdAt?.split("T")[0] },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 lg:px-6 py-10'>
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6A38C2] mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Jobs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#6A38C2]/10 to-[#8B5CF6]/10 border border-[#6A38C2]/20 flex items-center justify-center overflow-hidden shrink-0">
                                    {singleJob?.company?.logo
                                        ? <img src={singleJob.company.logo} alt={singleJob.company.name} className="w-full h-full object-contain p-1" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                                        : null
                                    }
                                    <span className="text-2xl font-bold text-[#6A38C2]" style={singleJob?.company?.logo ? {display:'none'} : {}}>
                                        {singleJob?.company?.name?.[0]?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>{singleJob?.title}</h1>
                                        {isExternalJob && (
                                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                                                singleJob?.source === 'Unstop' ? 'bg-orange-100 text-orange-600 border border-orange-200' :
                                                singleJob?.source === 'JSearch' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                                                'bg-gray-100 text-gray-600 border border-gray-200'
                                            }`}>
                                                via {singleJob?.source}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{singleJob?.company?.name} · India</p>
                                    <div className='flex flex-wrap items-center gap-2 mt-3'>
                                        {singleJob?.position && <span className="badge-indigo">{singleJob.position} Positions</span>}
                                        <span className="badge-coral">{singleJob?.jobType}</span>
                                        <span className="badge-purple">{formatSalary(singleJob?.salary)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-white/10">
                                Job Description
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 whitespace-pre-line">{singleJob?.description}</p>
                            {!isExternalJob && (
                                <p className="text-sm text-gray-500"><span className="font-semibold text-gray-700 dark:text-gray-200">Total Applicants:</span> {singleJob?.applications?.length ?? 0}</p>
                            )}
                        </div>

                        {/* Requirements */}
                        {singleJob?.requirements?.length > 0 && (
                            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-100 dark:border-white/10">
                                    Skills & Requirements
                                </h2>
                                <div className="flex flex-wrap gap-2">
                                    {singleJob.requirements.map((req, i) => (
                                        <span key={i} className="bg-[#6A38C2]/10 text-[#6A38C2] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#6A38C2]/20">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Apply Panel */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 sticky top-24">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Apply for this role</h3>
                            {!isExternalJob && !isApplied && (
                                <div className="mb-4">
                                    <Label className="text-sm text-gray-600 mb-2 block">Cover Letter (Optional)</Label>
                                    <textarea
                                        className="w-full rounded-xl p-3 border border-gray-200 dark:border-white/10 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/50"
                                        rows="4"
                                        placeholder="Why are you a great fit for this role?"
                                        value={coverLetter}
                                        onChange={(e) => setCoverLetter(e.target.value)}
                                    ></textarea>
                                </div>
                            )}
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={!isExternalJob && isApplied}
                                className={`w-full rounded-xl font-semibold py-5 mb-3 transition-all duration-200 ${
                                    !isExternalJob && isApplied
                                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white shadow-lg hover:shadow-[#6A38C2]/30 hover:scale-[1.02]'
                                }`}
                            >
                                {!isExternalJob && isApplied
                                    ? <><CheckCircle2 className="w-4 h-4 mr-2 inline" />Applied</>
                                    : isExternalJob
                                        ? <><ExternalLink className="w-4 h-4 mr-2 inline" />Apply on {singleJob?.source || 'Portal'}</>
                                        : 'Apply Now'
                                }
                            </Button>
                            <button
                                onClick={toggleSave}
                                className={`w-full rounded-xl py-2.5 text-sm font-semibold border flex items-center justify-center gap-2 transition-all duration-200 ${
                                    saved
                                        ? 'bg-[#6A38C2]/10 border-[#6A38C2]/30 text-[#6A38C2]'
                                        : 'border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2]'
                                }`}
                            >
                                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                                {saved ? 'Saved' : 'Save Job'}
                            </button>

                            {/* Job Details */}
                            <div className="mt-5 space-y-3">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Job Details</h4>
                                {details.map(({ icon, label, value }) => (
                                    value && (
                                        <div key={label} className="flex items-center gap-3 text-sm">
                                            <span className="text-[#6A38C2]">{icon}</span>
                                            <span className="text-gray-500 dark:text-gray-400 min-w-20">{label}</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">{value}</span>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription