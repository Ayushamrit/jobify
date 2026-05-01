import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './shared/Navbar';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, ExternalLink, MapPin, Briefcase, Clock, RefreshCw,
    Loader2, Globe, ChevronRight, Building2, Tag, Bookmark, BookmarkCheck
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useSelector } from 'react-redux';

// Portal metadata
const PORTALS = [
    {
        id: 'all',
        label: 'All Portals',
        icon: '🌐',
        color: 'from-[#6A38C2] to-[#8B5CF6]',
        textColor: 'text-[#6A38C2]',
        bg: 'bg-[#6A38C2]/10',
        border: 'border-[#6A38C2]/30',
    },
    {
        id: 'unstop',
        label: 'Unstop',
        icon: '🟠',
        color: 'from-orange-500 to-amber-500',
        textColor: 'text-orange-600',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        description: 'Indias #1 platform for college competitions & fresher jobs',
        url: 'https://unstop.com/jobs',
    },
    {
        id: 'naukri',
        label: 'Naukri.com',
        icon: '🔵',
        color: 'from-blue-600 to-blue-400',
        textColor: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        description: 'Indias largest job board with millions of listings',
        url: 'https://www.naukri.com/jobs-in-india',
    },
    {
        id: 'internshala',
        label: 'Internshala',
        icon: '🟣',
        color: 'from-purple-600 to-violet-400',
        textColor: 'text-purple-600',
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        description: 'Top internships & fresher jobs across India',
        url: 'https://internshala.com/internships',
    },
    {
        id: 'arbeitnow',
        label: 'Arbeitnow',
        icon: '🟢',
        color: 'from-green-600 to-emerald-400',
        textColor: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        description: 'Global remote-friendly engineering & tech jobs',
        url: 'https://www.arbeitnow.com',
    },
];

// Naukri & Internshala static redirect cards (they block scraping)
const NAUKRI_CATEGORIES = [
    { title: 'Software Engineer', query: 'software-engineer', count: '2.4L+' },
    { title: 'Data Scientist', query: 'data-scientist', count: '45K+' },
    { title: 'Product Manager', query: 'product-manager', count: '28K+' },
    { title: 'UI/UX Designer', query: 'ui-ux-designer', count: '18K+' },
    { title: 'DevOps Engineer', query: 'devops-engineer', count: '32K+' },
    { title: 'Full Stack Developer', query: 'full-stack-developer', count: '1.1L+' },
    { title: 'Business Analyst', query: 'business-analyst', count: '52K+' },
    { title: 'Digital Marketing', query: 'digital-marketing', count: '38K+' },
];

const INTERNSHALA_CATEGORIES = [
    { title: 'Web Development', query: 'web-development', count: '12K+' },
    { title: 'Machine Learning', query: 'machine-learning', count: '8K+' },
    { title: 'Marketing', query: 'marketing', count: '15K+' },
    { title: 'Graphic Design', query: 'graphic-design', count: '9K+' },
    { title: 'Content Writing', query: 'content-writing', count: '11K+' },
    { title: 'App Development', query: 'app-development', count: '6K+' },
    { title: 'Data Science', query: 'data-science', count: '7K+' },
    { title: 'Finance', query: 'finance', count: '5K+' },
];

const JobCard = ({ job, portalColor, portalTextColor, portalBg, portalBorder }) => {
    const daysAgo = Math.floor((new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24));
    const { user } = useSelector(store => store.auth);

    const handleApplyClick = async () => {
        if (!user) {
            toast.error("Please login to track your applications!");
            return;
        }

        try {
            // Log to our backend for centralized tracking
            await axios.post(`${APPLICATION_API_END_POINT}/log-external`, {
                title: job.title,
                company: job.company?.name || 'Unknown',
                logo: job.company?.logo,
                source: job.source,
                applyUrl: job.applyUrl
            }, { withCredentials: true });

            // Open the external URL
            window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
            toast.success(`Redirecting to ${job.source}... Application tracked!`);
        } catch (error) {
            console.error("Tracking error:", error);
            // Still open the URL even if tracking fails, but notify
            window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
        }
    };

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

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            whileHover={{ y: -3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col"
        >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl ${portalBg} ${portalBorder} border flex items-center justify-center overflow-hidden shrink-0`}>
                    {job.company?.logo
                        ? <img src={job.company.logo} alt={job.company.name} className="w-full h-full object-contain p-1" onError={e => e.target.style.display = 'none'} />
                        : <span className={`text-lg font-bold ${portalTextColor}`}>{job.company?.name?.[0]?.toUpperCase() || '?'}</span>
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{job.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{job.company?.name || 'Unknown Company'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] text-gray-400 shrink-0">{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
                    <button
                        onClick={toggleSave}
                        className={`p-1.5 rounded-lg transition-colors ${saved ? 'bg-[#6A38C2]/10 text-[#6A38C2]' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400'}`}
                    >
                        {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-1.5 mb-3">
                {job.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                        <MapPin className="w-3 h-3" /> {job.location.split(',')[0]}
                    </span>
                )}
                {job.jobType && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-lg">
                        <Briefcase className="w-3 h-3" /> {job.jobType}
                    </span>
                )}
            </div>

            {/* Description */}
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">{job.description}</p>

            {/* Skills */}
            {job.requirements?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {job.requirements.slice(0, 3).map((r, i) => (
                        <span key={i} className={`text-xs px-2 py-0.5 rounded-full font-medium ${portalBg} ${portalTextColor} ${portalBorder} border`}>
                            {r}
                        </span>
                    ))}
                    {job.requirements.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500">+{job.requirements.length - 3}</span>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-auto">
                <Button
                    onClick={handleApplyClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r ${portalColor} hover:opacity-90 transition-all duration-200 hover:scale-[1.02] shadow-sm`}
                >
                    <ExternalLink className="w-3.5 h-3.5" /> Apply on {job.source}
                </Button>
                <Button
                    onClick={toggleSave}
                    variant="outline"
                    className={`px-3 py-2.5 rounded-xl border-[#6A38C2]/20 ${saved ? 'bg-[#6A38C2] text-white hover:bg-[#5b30a6]' : 'text-[#6A38C2] hover:bg-[#6A38C2]/5'}`}
                >
                    {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </Button>
            </div>
        </motion.div>
    );
};

const RedirectCard = ({ title, count, url, textColor, bg, border }) => (
    <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -2, scale: 1.02 }}
        className={`${bg} ${border} border rounded-2xl p-4 flex items-center justify-between group cursor-pointer transition-all duration-200 hover:shadow-md`}
    >
        <div>
            <p className={`font-semibold text-sm ${textColor}`}>{title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{count} openings</p>
        </div>
        <ChevronRight className={`w-4 h-4 ${textColor} group-hover:translate-x-1 transition-transform duration-200`} />
    </motion.a>
);

const JobPortals = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [keyword, setKeyword] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [jobs, setJobs] = useState({ unstop: [], arbeitnow: [], jsearch: [] });
    const [loading, setLoading] = useState(false);
    const [lastFetched, setLastFetched] = useState(null);

    const fetchJobs = useCallback(async (kw = keyword) => {
        setLoading(true);
        try {
            const res = await axios.get(`${JOB_API_END_POINT}/portals?keyword=${encodeURIComponent(kw)}`);
            if (res.data.success) {
                setJobs(res.data.jobs);
                setLastFetched(new Date());
            }
        } catch (err) {
            toast.error('Failed to fetch portal jobs. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [keyword]);

    useEffect(() => {
        fetchJobs('');
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setKeyword(searchInput);
        fetchJobs(searchInput);
    };

    // Merge all jobs for "all" tab
    const allJobs = [
        ...jobs.unstop.map(j => ({ ...j, source: 'Unstop' })),
        ...jobs.arbeitnow.map(j => ({ ...j, source: 'Arbeitnow' })),
        ...jobs.jsearch.map(j => ({ ...j, source: 'JSearch' })),
    ];

    const getTabJobs = () => {
        if (activeTab === 'all') return allJobs;
        if (activeTab === 'unstop') return jobs.unstop;
        if (activeTab === 'arbeitnow') return jobs.arbeitnow;
        return [];
    };

    const portal = PORTALS.find(p => p.id === activeTab) || PORTALS[0];
    const tabJobs = getTabJobs();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] py-12 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-4"
                    >
                        <Globe className="w-3.5 h-3.5 text-yellow-400" />
                        Aggregated from India's top job portals
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-3"
                    >
                        Explore Jobs Across
                        <span className="bg-gradient-to-r from-[#a78bfa] to-[#F83002] bg-clip-text text-transparent"> All Portals</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-sm mb-6"
                    >
                        Search Unstop, Naukri, Internshala, and more — all in one place
                    </motion.p>

                    {/* Search Bar */}
                    <motion.form
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        onSubmit={handleSearch}
                        className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto"
                    >
                        <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl px-5 py-3.5 focus-within:border-[#8B5CF6] transition-colors">
                            <Search className="w-4 h-4 text-gray-300 shrink-0" />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="React Developer, Data Science, Design..."
                                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white font-semibold px-7 py-3.5 rounded-2xl hover:from-[#5b30a6] hover:to-[#7C3AED] hover:scale-105 transition-all duration-200 shadow-xl"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                        </Button>
                    </motion.form>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">

                {/* Portal Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-none">
                    {PORTALS.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setActiveTab(p.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-sm whitespace-nowrap transition-all duration-200 border shrink-0 ${activeTab === p.id
                                ? `bg-gradient-to-r ${p.color} text-white border-transparent shadow-lg`
                                : `bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#6A38C2]/40`
                                }`}
                        >
                            <span>{p.icon}</span> {p.label}
                        </button>
                    ))}
                </div>

                {/* Naukri Tab — Redirect Cards */}
                {activeTab === 'naukri' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-blue-100 dark:border-white/10 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                    <span className="text-xl">🔵</span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">Naukri.com</h2>
                                    <p className="text-sm text-gray-500">India's largest job portal — click any category to search</p>
                                </div>
                                <a href="https://www.naukri.com" target="_blank" rel="noopener noreferrer" className="ml-auto">
                                    <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                                        <ExternalLink className="w-3.5 h-3.5" /> Open Naukri
                                    </Button>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {NAUKRI_CATEGORIES.map(cat => (
                                <RedirectCard
                                    key={cat.query}
                                    title={cat.title}
                                    count={cat.count}
                                    url={`https://www.naukri.com/${cat.query}-jobs`}
                                    textColor="text-blue-600"
                                    bg="bg-blue-50 dark:bg-blue-900/20"
                                    border="border-blue-200 dark:border-blue-800"
                                />
                            ))}
                        </div>
                        <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-2xl text-center">
                            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                🔵 Naukri.com has 1Cr+ active job listings. Click any category above to view real jobs on Naukri.
                            </p>
                            <a href={`https://www.naukri.com/jobs-in-india${searchInput ? `?k=${encodeURIComponent(searchInput)}` : ''}`} target="_blank" rel="noopener noreferrer">
                                <Button className="mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    {searchInput ? `Search "${searchInput}" on Naukri` : 'Browse All Naukri Jobs'}
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Internshala Tab — Redirect Cards */}
                {activeTab === 'internshala' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-purple-100 dark:border-white/10 p-6 mb-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                    <span className="text-xl">🟣</span>
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-900 dark:text-white">Internshala</h2>
                                    <p className="text-sm text-gray-500">India's top internship & fresher job platform</p>
                                </div>
                                <a href="https://internshala.com" target="_blank" rel="noopener noreferrer" className="ml-auto">
                                    <Button size="sm" className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-2">
                                        <ExternalLink className="w-3.5 h-3.5" /> Open Internshala
                                    </Button>
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {INTERNSHALA_CATEGORIES.map(cat => (
                                <RedirectCard
                                    key={cat.query}
                                    title={cat.title}
                                    count={cat.count}
                                    url={`https://internshala.com/internships/${cat.query}-internship`}
                                    textColor="text-purple-600"
                                    bg="bg-purple-50 dark:bg-purple-900/20"
                                    border="border-purple-200 dark:border-purple-800"
                                />
                            ))}
                        </div>
                        <div className="mt-6 p-5 bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800/30 rounded-2xl text-center">
                            <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                🟣 Internshala has 50,000+ active internships for students & freshers.
                            </p>
                            <a href={`https://internshala.com/internships${searchInput ? `/internship-in-${encodeURIComponent(searchInput)}` : ''}`} target="_blank" rel="noopener noreferrer">
                                <Button className="mt-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-2">
                                    <ExternalLink className="w-4 h-4" />
                                    {searchInput ? `Find "${searchInput}" Internships` : 'Browse All Internships'}
                                </Button>
                            </a>
                        </div>
                    </motion.div>
                )}

                {/* Live job tabs: all, unstop, arbeitnow */}
                {(activeTab === 'all' || activeTab === 'unstop' || activeTab === 'arbeitnow') && (
                    <>
                        {/* Stats bar */}
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className="font-bold text-gray-900 dark:text-white">
                                    {loading ? 'Fetching jobs...' : `${tabJobs.length} jobs found`}
                                    {keyword && <span className="text-gray-400 font-normal text-sm ml-2">for "{keyword}"</span>}
                                </h2>
                                {lastFetched && (
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Last updated: {lastFetched.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => fetchJobs(keyword)}
                                disabled={loading}
                                className="flex items-center gap-2 text-sm text-[#6A38C2] hover:text-[#5b30a6] font-semibold transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </button>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-white/10 animate-pulse">
                                        <div className="flex gap-3 mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                        </div>
                                        <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded-xl mt-4" />
                                    </div>
                                ))}
                            </div>
                        ) : tabJobs.length === 0 ? (
                            <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No jobs found</h3>
                                <p className="text-gray-400 text-sm mb-4">Try a different search term or refresh</p>
                                <Button onClick={() => fetchJobs('')} className="rounded-xl bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-semibold">
                                    Browse All Jobs
                                </Button>
                            </div>
                        ) : (
                            <AnimatePresence>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {tabJobs.map((job, i) => {
                                        const src = PORTALS.find(p => p.label === job.source) || PORTALS[0];
                                        return (
                                            <JobCard
                                                key={job._id || i}
                                                job={job}
                                                portalColor={src.color}
                                                portalTextColor={src.textColor}
                                                portalBg={src.bg}
                                                portalBorder={src.border}
                                            />
                                        );
                                    })}
                                </div>
                            </AnimatePresence>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default JobPortals;
