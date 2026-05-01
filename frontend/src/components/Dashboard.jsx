import React, { useMemo } from 'react';
import Navbar from './shared/Navbar';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
    Briefcase, CheckCircle2, XCircle, Clock, TrendingUp,
    Code2, Star, Zap, Award, Target, MessageSquare
} from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#6A38C2', '#F83002', '#8B5CF6', '#10B981', '#F59E0B', '#3B82F6'];

const Dashboard = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const { allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();

    // 1. Calculate Stats
    const stats = useMemo(() => {
        const total = allAppliedJobs?.length || 0;
        const accepted = allAppliedJobs?.filter(j => j.status?.toLowerCase() === 'accepted' || j.status?.toLowerCase() === 'selected' || j.status?.toLowerCase() === 'shortlisted').length || 0;
        const rejected = allAppliedJobs?.filter(j => j.status?.toLowerCase() === 'rejected').length || 0;
        const pending = allAppliedJobs?.filter(j => j.status?.toLowerCase() === 'pending' || j.status?.toLowerCase() === 'applied').length || 0;

        return { total, accepted, rejected, pending };
    }, [allAppliedJobs]);

    // 2. Prepare Chart Data (Applications over time - last 6 months)
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const data = months.map(m => ({ name: m, applications: 0 }));

        allAppliedJobs?.forEach(job => {
            const date = new Date(job.createdAt);
            const monthIndex = date.getMonth();
            data[monthIndex].applications += 1;
        });

        // Return only the last 6 months
        const currentMonth = new Date().getMonth();
        const startMonth = (currentMonth - 5 + 12) % 12;

        const result = [];
        for (let i = 0; i < 6; i++) {
            result.push(data[(startMonth + i) % 12]);
        }
        return result;
    }, [allAppliedJobs]);

    // 3. Domain Insights (Pie Chart)
    const domainData = useMemo(() => {
        const domains = {};
        allAppliedJobs?.forEach(app => {
            const jobData = app.isExternal ? app.externalJobDetails : app.job;
            const role = jobData?.title || 'Unknown';
            const category = role.split(' ')[0]; // Simplified grouping
            domains[category] = (domains[category] || 0) + 1;
        });
        const result = Object.entries(domains).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 5);
        return result.length > 0 ? result : [{ name: 'No Data', value: 1 }];
    }, [allAppliedJobs]);

    // 4. Smart Recommendations (Based on skills)
    const recommendations = useMemo(() => {
        if (!user?.profile?.skills || !allJobs) return [];
        const userSkills = user.profile.skills.map(s => s.toLowerCase());

        return allJobs.filter(job => {
            // Check if already applied
            const alreadyApplied = allAppliedJobs?.some(app => app.job?._id === job._id || (app.isExternal && app.externalJobDetails?.applyUrl === job.applyUrl));
            if (alreadyApplied) return false;

            // Simple keyword matching
            const jobText = `${job.title} ${job.description} ${job.requirements?.join(' ')}`.toLowerCase();
            return userSkills.some(skill => jobText.includes(skill));
        }).slice(0, 4);
    }, [allJobs, user, allAppliedJobs]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Welcome back, {user?.fullname?.split(' ')[0]}! <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Here is what's happening with your job search today.</p>
                    </div>
                    <Button
                        onClick={() => navigate('/browse')}
                        className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:scale-105 transition-all duration-200 rounded-xl font-semibold"
                    >
                        Browse New Jobs
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Applied', value: stats.total, icon: <Briefcase className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20' },
                        { label: 'Shortlisted', value: stats.accepted, icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: 'bg-green-50 dark:bg-green-900/20' },
                        { label: 'Rejected', value: stats.rejected, icon: <XCircle className="w-5 h-5 text-red-500" />, bg: 'bg-red-50 dark:bg-red-900/20' },
                        { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5 text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`${s.bg} p-5 rounded-2xl border border-white/10 flex items-center justify-between shadow-sm`}
                        >
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{s.label}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{s.value}</p>
                            </div>
                            <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl">{s.icon}</div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Activity Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2 bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-[#6A38C2]" /> Application Activity
                            </h3>
                        </div>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888888' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        cursor={{ fill: '#6A38C210' }}
                                    />
                                    <Bar dataKey="applications" fill="#6A38C2" radius={[6, 6, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Domain Insights */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm"
                    >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-6">Domain Insights</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={domainData}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {domainData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {domainData.map((d, i) => (
                                <div key={i} className="flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
                                    </div>
                                    <span className="font-bold text-gray-900 dark:text-white">{Math.round((d.value / (stats.total || 1)) * 100) || 0}%</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coding Stats / Profile Tracker */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-[#0f0c29] to-[#302b63] p-6 rounded-3xl text-white shadow-xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-yellow-400" /> Coding Activity
                            </h3>
                            <Award className="w-6 h-6 text-yellow-400" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">GitHub Contributions</p>
                                <p className="text-xl font-bold mt-1">450+</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">LeetCode Rank</p>
                                <p className="text-xl font-bold mt-1">#12,450</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png" className="w-6 h-6 invert" alt="LeetCode" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">LeetCode</p>
                                        <p className="text-[10px] text-gray-400">145 Problems Solved</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-yellow-400">Knight</p>
                                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                        <div className="w-2/3 h-full bg-yellow-400" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">
                                        <Code2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold">GitHub</p>
                                        <p className="text-[10px] text-gray-400">24 Repositories</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-purple-400">Pro</p>
                                    <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
                                        <div className="w-4/5 h-full bg-purple-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Smart Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm"
                    >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Smart Recommendations
                        </h3>
                        {recommendations.length === 0 ? (
                            <div className="text-center py-10 opacity-50">
                                <p className="text-sm">Complete your profile to see tailored recommendations.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recommendations.map((job, i) => (
                                    <div
                                        key={i}
                                        onClick={() => navigate(`/description/${job._id}`)}
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all cursor-pointer group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-[#6A38C2]/10 flex items-center justify-center overflow-hidden">
                                            {job.company?.logo
                                                ? <img src={job.company.logo} className="w-full h-full object-contain" />
                                                : <span className="font-bold text-[#6A38C2]">{job.company?.name?.[0]}</span>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{job.title}</p>
                                            <p className="text-xs text-gray-500 truncate">{job.company?.name} • {job.location}</p>
                                        </div>
                                        <Zap className="w-4 h-4 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <Button
                            variant="link"
                            className="w-full text-[#6A38C2] mt-2 font-bold text-sm"
                            onClick={() => navigate('/browse')}
                        >
                            View All Opportunities →
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
