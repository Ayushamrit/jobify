import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Building2, Plus, Search } from 'lucide-react'
import { motion } from 'framer-motion'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-6xl mx-auto px-4 lg:px-6 py-10'>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='flex flex-col md:flex-row items-center justify-between gap-4 mb-8'
                >
                    <div className='flex items-center gap-3'>
                        <div className='w-12 h-12 rounded-2xl bg-[#6A38C2]/10 flex items-center justify-center'>
                            <Building2 className='w-6 h-6 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>Manage Companies</h1>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>Add and manage your registered companies</p>
                        </div>
                    </div>
                    
                    <div className='flex items-center gap-3 w-full md:w-auto'>
                        <div className='relative flex-1 md:w-72'>
                            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                            <Input
                                className="pl-10 rounded-xl border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                placeholder="Filter by company name..."
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        <Button 
                            onClick={() => navigate("/admin/companies/create")}
                            className="rounded-xl bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-semibold shadow-lg hover:shadow-[#6A38C2]/30 transition-all duration-200"
                        >
                            <Plus className='w-4 h-4 mr-2' /> New Company
                        </Button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden p-6'
                >
                    <CompaniesTable />
                </motion.div>
            </div>
        </div>
    )
}

export default Companies