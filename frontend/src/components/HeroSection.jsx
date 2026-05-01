import React, { useState } from 'react'
import { Search, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const popularSearches = ["React Developer", "Product Manager", "Data Scientist", "UI/UX Designer"];

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] min-h-[92vh] flex items-center">
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#6A38C2]/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#F83002]/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            <div className="relative max-w-7xl mx-auto px-4 lg:px-6 py-24 text-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium px-5 py-2 rounded-full mb-8"
                >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    India's #1 Job Hunt Platform
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
                >
                    Search, Apply &
                    <br />
                    <span className="bg-gradient-to-r from-[#a78bfa] via-[#8B5CF6] to-[#F83002] bg-clip-text text-transparent">
                        Land Your Dream Job
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10"
                >
                    Connect with top companies, discover thousands of opportunities, and take the next step in your career journey.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-6"
                >
                    <div className="flex-1 w-full flex items-center gap-3 bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 rounded-2xl px-5 py-4 shadow-2xl transition-all duration-300 focus-within:border-[#8B5CF6]">
                        <Search className="w-5 h-5 text-gray-300 shrink-0" />
                        <input
                            type="text"
                            placeholder="Job title, skills, or company..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchJobHandler()}
                            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-base"
                        />
                    </div>
                    <Button
                        onClick={searchJobHandler}
                        className="w-full sm:w-auto bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-semibold px-8 py-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-200 text-base"
                    >
                        Search Jobs
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-2 mb-16"
                >
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" /> Trending:
                    </span>
                    {popularSearches.map((s) => (
                        <button
                            key={s}
                            onClick={() => { dispatch(setSearchedQuery(s)); navigate('/browse'); }}
                            className="text-sm bg-white/10 hover:bg-white/20 text-gray-200 border border-white/10 px-4 py-1.5 rounded-full transition-all duration-200"
                        >
                            {s}
                        </button>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
                >
                    {[
                        { value: '1,200+', label: 'Companies' },
                        { value: '15,000+', label: 'Jobs Posted' },
                        { value: '50,000+', label: 'Job Seekers' },
                    ].map((stat) => (
                        <div key={stat.label} className="stat-card">
                            <span className="text-2xl md:text-3xl font-bold text-white">{stat.value}</span>
                            <span className="text-xs text-gray-400 mt-1">{stat.label}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection