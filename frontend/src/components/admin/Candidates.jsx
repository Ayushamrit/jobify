import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Search, MapPin, Briefcase, Mail, Contact, FileText } from 'lucide-react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { motion } from 'framer-motion'

const Candidates = () => {
    const [candidates, setCandidates] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${USER_API_END_POINT}/candidates?keyword=${keyword}`, {
                withCredentials: true
            });
            if (res.data.success) {
                setCandidates(res.data.candidates);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        // Initial fetch
        fetchCandidates();
    }, []);

    const searchHandler = (e) => {
        e.preventDefault();
        fetchCandidates();
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-10'>
                <div className="mb-8">
                    <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>Candidate Database</h1>
                    <p className='text-sm text-gray-500'>Search and discover top talent for your company</p>
                </div>

                <form onSubmit={searchHandler} className="flex items-center gap-3 mb-10 bg-white dark:bg-gray-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input 
                            type="text" 
                            placeholder="Search by name, email, or skills (e.g. React, Node.js)" 
                            className="pl-12 py-6 rounded-xl border-none shadow-none focus-visible:ring-0 text-base"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="rounded-xl py-6 px-8 bg-[#6A38C2] hover:bg-[#5b30a6] text-white">
                        {loading ? 'Searching...' : 'Search Candidates'}
                    </Button>
                </form>

                {candidates.length === 0 && !loading ? (
                    <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-white/10">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No candidates found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {candidates.map((candidate, index) => (
                            <motion.div 
                                key={candidate._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <Avatar className="w-16 h-16 rounded-2xl border border-gray-100 dark:border-white/10">
                                        <AvatarImage src={candidate.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                    </Avatar>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{candidate.fullname}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-1">{candidate.profile?.bio || 'No bio provided'}</p>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 mb-5">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Mail className="w-4 h-4 text-[#6A38C2]" /> {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Contact className="w-4 h-4 text-[#6A38C2]" /> {candidate.phoneNumber}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Top Skills</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {candidate.profile?.skills?.length > 0 ? (
                                            candidate.profile.skills.slice(0, 4).map((skill, i) => (
                                                <Badge key={i} variant="secondary" className="bg-[#6A38C2]/10 text-[#6A38C2] border-none font-medium">
                                                    {skill}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-400">No skills listed</span>
                                        )}
                                        {candidate.profile?.skills?.length > 4 && (
                                            <Badge variant="secondary" className="bg-gray-100 text-gray-500 border-none">
                                                +{candidate.profile.skills.length - 4} more
                                            </Badge>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                                    {candidate.profile?.resume ? (
                                        <a 
                                            href={candidate.profile.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button variant="outline" className="w-full rounded-xl border-[#6A38C2]/20 text-[#6A38C2] hover:bg-[#6A38C2]/5">
                                                <FileText className="w-4 h-4 mr-2" /> View Resume
                                            </Button>
                                        </a>
                                    ) : (
                                        <Button disabled variant="outline" className="flex-1 w-full rounded-xl">
                                            No Resume
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Candidates
