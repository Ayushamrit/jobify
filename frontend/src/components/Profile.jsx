import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText, Download, Star, Briefcase, CheckCircle, Globe } from 'lucide-react'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { motion } from 'framer-motion'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const skills = user?.profile?.skills || [];

    const skillColors = [
        'bg-[#6A38C2]/10 text-[#6A38C2] border-[#6A38C2]/20',
        'bg-[#F83002]/10 text-[#F83002] border-[#F83002]/20',
        'bg-blue-50 text-blue-700 border-blue-200',
        'bg-emerald-50 text-emerald-700 border-emerald-200',
        'bg-amber-50 text-amber-700 border-amber-200',
        'bg-pink-50 text-pink-700 border-pink-200',
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-48 bg-gradient-to-r from-[#0f0c29] via-[#302b63] to-[#24243e]">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-4 left-20 w-32 h-32 bg-[#6A38C2]/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-20 w-40 h-40 bg-[#F83002]/10 rounded-full blur-2xl" />
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 lg:px-6 -mt-20 pb-12 relative z-10">
                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 p-6 mb-6'
                >
                    <div className='flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between'>
                        <div className='flex items-center gap-5'>
                            <Avatar className="h-24 w-24 ring-4 ring-white dark:ring-gray-900 shadow-xl">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"}
                                    alt="profile"
                                />
                            </Avatar>
                            <div>
                                <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>{user?.fullname}</h1>
                                <p className='text-gray-500 dark:text-gray-400 mt-1'>{user?.profile?.bio || 'Add a bio to introduce yourself'}</p>
                                <div className="flex flex-wrap items-center gap-4 mt-3">
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                        <Mail className="w-3.5 h-3.5 text-[#6A38C2]" /> {user?.email}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                                        <Contact className="w-3.5 h-3.5 text-[#6A38C2]" /> {user?.phoneNumber}
                                    </span>
                                    {user?.profile?.github && (
                                        <a href={user.profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#6A38C2] dark:text-gray-400 transition-colors">
                                            <Globe className="w-3.5 h-3.5" /> GitHub
                                        </a>
                                    )}
                                    {user?.profile?.linkedin && (
                                        <a href={user.profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#6A38C2] dark:text-gray-400 transition-colors">
                                            <Globe className="w-3.5 h-3.5" /> LinkedIn
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => setOpen(true)}
                            variant="outline"
                            className="shrink-0 rounded-xl border-[#6A38C2]/30 text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all duration-200 flex items-center gap-2 font-semibold"
                        >
                            <Pen className="w-4 h-4" /> Edit Profile
                        </Button>
                    </div>

                    {/* Skills */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills</h2>
                        <div className='flex flex-wrap items-center gap-2'>
                            {skills.length !== 0
                                ? skills.map((item, index) => (
                                    <span
                                        key={index}
                                        className={`text-xs px-3 py-1.5 rounded-full font-semibold border ${skillColors[index % skillColors.length]}`}
                                    >
                                        {item}
                                    </span>
                                ))
                                : <span className="text-sm text-gray-400">No skills added yet</span>
                            }
                        </div>
                    </div>

                    {/* Resume */}
                    {user?.profile?.resume && (
                        <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/10">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Resume</h2>
                            <a
                                href={user.profile.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 bg-[#6A38C2]/5 hover:bg-[#6A38C2]/10 border border-[#6A38C2]/20 rounded-xl px-4 py-3 transition-all duration-200 group"
                            >
                                <FileText className="w-5 h-5 text-[#6A38C2]" />
                                <span className="text-sm font-semibold text-[#6A38C2] group-hover:underline">
                                    {user.profile.resumeOriginalName || 'View Resume'}
                                </span>
                                <Download className="w-4 h-4 text-[#6A38C2] ml-2" />
                            </a>
                        </div>
                    )}
                </motion.div>

                {/* Applied Jobs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 p-6'
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Briefcase className="w-5 h-5 text-[#6A38C2]" />
                        <h2 className='font-bold text-lg text-gray-900 dark:text-white'>Applied Jobs</h2>
                    </div>
                    <AppliedJobTable />
                </motion.div>
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile