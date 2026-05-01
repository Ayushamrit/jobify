import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { ArrowLeft, Loader2, Upload, Globe, MapPin, Building2, FileText } from 'lucide-react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { motion } from 'framer-motion'

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        industry: "",
        employeeCount: "",
        foundedYear: "",
        linkedin: "",
        twitter: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        formData.append("industry", input.industry);
        formData.append("employeeCount", input.employeeCount);
        formData.append("foundedYear", input.foundedYear);
        formData.append("linkedin", input.linkedin);
        formData.append("twitter", input.twitter);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            industry: singleCompany.industry || "",
            employeeCount: singleCompany.employeeCount || "",
            foundedYear: singleCompany.foundedYear || "",
            linkedin: singleCompany.socialLinks?.linkedin || "",
            twitter: singleCompany.socialLinks?.twitter || "",
            file: singleCompany.file || null
        })
    }, [singleCompany]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 lg:px-6 py-10'>
                <form onSubmit={submitHandler}>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden'
                    >
                        <div className='p-8 md:p-10 border-b border-gray-100 dark:border-white/10 flex items-center justify-between'>
                            <div className='flex items-center gap-4'>
                                <Button 
                                    type="button"
                                    onClick={() => navigate("/admin/companies")} 
                                    variant="ghost" 
                                    className="rounded-full w-10 h-10 p-0 hover:bg-[#6A38C2]/10 text-[#6A38C2]"
                                >
                                    <ArrowLeft className='w-5 h-5' />
                                </Button>
                                <div>
                                    <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>Company Setup</h1>
                                    <p className='text-sm text-gray-500'>Complete your company profile to attract more candidates</p>
                                </div>
                            </div>
                        </div>

                        <div className='p-8 md:p-10'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Building2 className='w-4 h-4 text-[#6A38C2]' /> Company Name
                                    </Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={input.name}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="e.g. Microsoft"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <FileText className='w-4 h-4 text-[#6A38C2]' /> Description
                                    </Label>
                                    <Input
                                        type="text"
                                        name="description"
                                        value={input.description}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="Briefly describe your company"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Globe className='w-4 h-4 text-[#6A38C2]' /> Website
                                    </Label>
                                    <Input
                                        type="text"
                                        name="website"
                                        value={input.website}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="https://example.com"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <MapPin className='w-4 h-4 text-[#6A38C2]' /> Location
                                    </Label>
                                    <Input
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="e.g. Hyderabad, India"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Building2 className='w-4 h-4 text-[#6A38C2]' /> Industry
                                    </Label>
                                    <Input
                                        type="text"
                                        name="industry"
                                        value={input.industry}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="e.g. Information Technology"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Building2 className='w-4 h-4 text-[#6A38C2]' /> Employee Count
                                    </Label>
                                    <Input
                                        type="text"
                                        name="employeeCount"
                                        value={input.employeeCount}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="e.g. 50-200"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Building2 className='w-4 h-4 text-[#6A38C2]' /> Founded Year
                                    </Label>
                                    <Input
                                        type="number"
                                        name="foundedYear"
                                        value={input.foundedYear}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="e.g. 2015"
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Globe className='w-4 h-4 text-[#6A38C2]' /> LinkedIn URL
                                    </Label>
                                    <Input
                                        type="text"
                                        name="linkedin"
                                        value={input.linkedin}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="https://linkedin.com/company/..."
                                    />
                                </div>
                                <div className='space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Globe className='w-4 h-4 text-[#6A38C2]' /> Twitter URL
                                    </Label>
                                    <Input
                                        type="text"
                                        name="twitter"
                                        value={input.twitter}
                                        onChange={changeEventHandler}
                                        className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                        placeholder="https://twitter.com/..."
                                    />
                                </div>
                                <div className='md:col-span-2 space-y-2'>
                                    <Label className="text-sm font-semibold flex items-center gap-2">
                                        <Upload className='w-4 h-4 text-[#6A38C2]' /> Company Logo
                                    </Label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-[#6A38C2]/5 hover:border-[#6A38C2]/50 transition-all group">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#6A38C2] mb-2" />
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {input.file ? input.file.name : <span className="font-semibold text-[#6A38C2]">Click to upload company logo</span>}
                                                </p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={changeFileHandler} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10'>
                                {
                                    loading ? (
                                        <Button disabled className="w-full rounded-xl py-6 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]">
                                            <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please wait
                                        </Button>
                                    ) : (
                                        <Button 
                                            type="submit" 
                                            className="w-full rounded-xl py-6 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-bold text-lg shadow-lg hover:shadow-[#6A38C2]/30 hover:scale-[1.01] transition-all"
                                        >
                                            Update Profile
                                        </Button>
                                    )
                                }
                            </div>
                        </div>
                    </motion.div>
                </form>
            </div>
        </div>
    )
}

export default CompanySetup