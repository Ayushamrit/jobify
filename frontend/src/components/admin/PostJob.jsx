import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Loader2, BriefcaseBusiness, FileText, IndianRupee, MapPin, Clock, Users, ListPlus, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: "",
        workMode: "",
        perks: "",
        applicationDeadline: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany._id });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.companyId) {
            toast.error("Please select a company first");
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 lg:px-6 py-10'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden'
                >
                    <div className='p-8 md:p-10 border-b border-gray-100 dark:border-white/10 flex items-center gap-4'>
                        <div className='w-14 h-14 rounded-2xl bg-[#6A38C2]/10 flex items-center justify-center'>
                            <BriefcaseBusiness className='w-7 h-7 text-[#6A38C2]' />
                        </div>
                        <div>
                            <h1 className='font-bold text-2xl text-gray-900 dark:text-white'>Post New Job</h1>
                            <p className='text-sm text-gray-500'>Fill in the details to publish a new job opportunity</p>
                        </div>
                    </div>

                    <form onSubmit={submitHandler} className='p-8 md:p-10'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className='w-4 h-4 text-[#6A38C2]' /> Job Title
                                </Label>
                                <Input
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="e.g. Frontend Developer"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <ListPlus className='w-4 h-4 text-[#6A38C2]' /> Description
                                </Label>
                                <Input
                                    type="text"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="Briefly describe the role"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className='w-4 h-4 text-[#6A38C2]' /> Requirements
                                </Label>
                                <Input
                                    type="text"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="Comma separated skills"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <IndianRupee className='w-4 h-4 text-[#6A38C2]' /> Salary (LPA)
                                </Label>
                                <Input
                                    type="text"
                                    name="salary"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="e.g. 12"
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
                                    placeholder="e.g. Bangalore, India"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className='w-4 h-4 text-[#6A38C2]' /> Job Type
                                </Label>
                                <Input
                                    type="text"
                                    name="jobType"
                                    value={input.jobType}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="Full-time, Part-time, Remote"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className='w-4 h-4 text-[#6A38C2]' /> Experience Level (Years)
                                </Label>
                                <Input
                                    type="text"
                                    name="experience"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="e.g. 2"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className='w-4 h-4 text-[#6A38C2]' /> Work Mode
                                </Label>
                                <Select onValueChange={(value) => setInput({...input, workMode: value})}>
                                    <SelectTrigger className="w-full rounded-xl py-6 border-gray-200 dark:border-white/10">
                                        <SelectValue placeholder="Remote, Hybrid, On-site" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Remote">Remote</SelectItem>
                                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                                            <SelectItem value="On-site">On-site</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <FileText className='w-4 h-4 text-[#6A38C2]' /> Perks
                                </Label>
                                <Input
                                    type="text"
                                    name="perks"
                                    value={input.perks}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="Comma separated (e.g. Health Insurance, Gym)"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Clock className='w-4 h-4 text-[#6A38C2]' /> Application Deadline
                                </Label>
                                <Input
                                    type="date"
                                    name="applicationDeadline"
                                    value={input.applicationDeadline}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2">
                                    <Users className='w-4 h-4 text-[#6A38C2]' /> Number of Positions
                                </Label>
                                <Input
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    className="rounded-xl py-5 border-gray-200 dark:border-white/10 focus:ring-[#6A38C2]/20"
                                    placeholder="e.g. 5"
                                />
                            </div>
                            <div className='md:col-span-2 space-y-2'>
                                <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                                    <Building2 className='w-4 h-4 text-[#6A38C2]' /> Select Company
                                </Label>
                                {companies.length > 0 ? (
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full rounded-xl py-6 border-gray-200 dark:border-white/10">
                                            <SelectValue placeholder="Select a registered company" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 dark:border-white/10">
                                            <SelectGroup>
                                                {companies.map((company) => (
                                                    <SelectItem key={company._id} value={company?.name?.toLowerCase()} className="rounded-lg">
                                                        {company.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-xl'>
                                        <p className='text-xs text-red-600 dark:text-red-400 font-bold text-center'>
                                            *Please register a company first before posting a job.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {loading ? (
                            <Button disabled className="w-full rounded-xl py-6 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]">
                                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button 
                                type="submit" 
                                className="w-full rounded-xl py-6 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-bold text-lg shadow-lg hover:shadow-[#6A38C2]/30 hover:scale-[1.01] transition-all"
                            >
                                Publish Job
                            </Button>
                        )}
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default PostJob