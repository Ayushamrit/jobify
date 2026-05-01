import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import ApplicantsTable from './ApplicantsTable'
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';

const Applicants = () => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllApplicants();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 lg:px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='mb-8'
                >
                    <Button 
                        onClick={() => navigate(-1)} 
                        variant="ghost" 
                        className="mb-4 text-gray-500 hover:text-[#6A38C2] flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Jobs
                    </Button>
                    
                    <div className='flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-2xl bg-[#6A38C2]/10 flex items-center justify-center'>
                            <Users className='w-7 h-7 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='font-bold text-3xl text-gray-900 dark:text-white'>
                                Applicants 
                                <span className="ml-3 text-sm bg-[#6A38C2] text-white px-3 py-1 rounded-full align-middle">
                                    {applicants?.applications?.length || 0}
                                </span>
                            </h1>
                            <p className='text-gray-500 dark:text-gray-400 mt-1'>Review and manage candidates who applied for this role</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden p-6'
                >
                    <ApplicantsTable />
                </motion.div>
            </div>
        </div>
    )
}

export default Applicants