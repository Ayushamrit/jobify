import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { Building2, ArrowLeft, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const dispatch = useDispatch();

    const registerNewCompany = async () => {
        if (!companyName) {
            toast.error("Company name is required");
            return;
        }
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 lg:px-6 py-20'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100 dark:border-white/10'
                >
                    <div className='mb-8'>
                        <div className='w-14 h-14 rounded-2xl bg-[#6A38C2]/10 flex items-center justify-center mb-6'>
                            <Building2 className='w-7 h-7 text-[#6A38C2]' />
                        </div>
                        <h1 className='font-bold text-3xl text-gray-900 dark:text-white mb-2'>Let's register your company</h1>
                        <p className='text-gray-500 dark:text-gray-400'>What would you like to call your company? You can always change this later in settings.</p>
                    </div>

                    <div className='space-y-6'>
                        <div>
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">Company Name</Label>
                            <Input
                                type="text"
                                className="rounded-xl py-6 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                placeholder="e.g. Microsoft, Google, Jobify"
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                        </div>

                        <div className='flex items-center gap-4 pt-4'>
                            <Button 
                                variant="outline" 
                                onClick={() => navigate("/admin/companies")}
                                className="rounded-xl px-6 py-6 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold transition-all"
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={registerNewCompany}
                                className="rounded-xl px-8 py-6 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-semibold shadow-lg hover:shadow-[#6A38C2]/30 transition-all flex items-center gap-2"
                            >
                                Continue <Plus className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default CompanyCreate