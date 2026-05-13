import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, BriefcaseBusiness, GraduationCap, Building2, Upload } from 'lucide-react'
import { auth, googleProvider } from '../../firebase'
import { signInWithPopup } from 'firebase/auth'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "", email: "", phoneNumber: "", password: "", role: "", file: ""
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) formData.append("file", input.file);

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    const handleGoogleLogin = async () => {
        if (!input.role) {
            toast.error("Please select a role first!");
            return;
        }
        try {
            dispatch(setLoading(true));
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const res = await axios.post(`${USER_API_END_POINT}/google-login`, {
                fullname: user.displayName,
                email: user.email,
                profilePhoto: user.photoURL,
                role: input.role,
                idToken // Sending token for backend verification
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("FULL FIREBASE ERROR:", error);
            toast.error(error.response?.data?.message || error.message || "Google Sign-In failed");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) navigate("/");
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            <div className='grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-64px)]'>

                {/* Left Branding */}
                <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-12 relative overflow-hidden">
                    <div className="absolute top-10 left-10 w-40 h-40 bg-[#6A38C2]/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-52 h-52 bg-[#F83002]/10 rounded-full blur-3xl" />
                    <div className="relative z-10 text-center">
                        <div className='flex items-center justify-center gap-3 mb-8'>
                            <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center shadow-2xl'>
                                <BriefcaseBusiness className='w-7 h-7 text-white' />
                            </div>
                            <h1 className='text-4xl font-bold text-white'>Job<span className="bg-gradient-to-r from-[#a78bfa] to-[#8B5CF6] bg-clip-text text-transparent">ify</span></h1>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Start Your Journey</h2>
                        <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
                            Join thousands of job seekers and recruiters on India's fastest growing job portal.
                        </p>
                        <div className="mt-10 space-y-3 text-left">
                            {['Free to sign up — always', 'Apply to unlimited jobs', 'Get noticed by top companies', 'Track all your applications'].map(f => (
                                <div key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-green-400">✓</span> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <div className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-md">
                        <div className="mb-7">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Join Jobify today — it's free!</p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-4">
                            {/* Role Toggle */}
                            <div>
                                <Label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 block">I am a</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { value: 'student', label: 'Job Seeker', Icon: GraduationCap },
                                        { value: 'recruiter', label: 'Recruiter', Icon: Building2 },
                                    ].map(({ value, label, Icon }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setInput({ ...input, role: value })}
                                            className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all duration-200 ${
                                                input.role === value
                                                    ? 'border-[#6A38C2] bg-[#6A38C2]/5 text-[#6A38C2]'
                                                    : 'border-gray-200 dark:border-white/10 text-gray-500 hover:border-[#6A38C2]/50'
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Full Name</Label>
                                    <Input type="text" value={input.fullname} name="fullname" onChange={changeEventHandler} placeholder="John Doe" className="rounded-xl py-5 border-gray-200 dark:border-white/10" />
                                </div>
                                <div>
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Phone</Label>
                                    <Input type="text" value={input.phoneNumber} name="phoneNumber" onChange={changeEventHandler} placeholder="9876543210" className="rounded-xl py-5 border-gray-200 dark:border-white/10" />
                                </div>
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email</Label>
                                <Input type="email" value={input.email} name="email" onChange={changeEventHandler} placeholder="you@example.com" className="rounded-xl py-5 border-gray-200 dark:border-white/10" />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Password</Label>
                                <Input type="password" value={input.password} name="password" onChange={changeEventHandler} placeholder="••••••••" className="rounded-xl py-5 border-gray-200 dark:border-white/10" />
                            </div>

                            <div>
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Profile Photo</Label>
                                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-white/10 cursor-pointer hover:border-[#6A38C2] transition-colors group">
                                    <Upload className="w-4 h-4 text-gray-400 group-hover:text-[#6A38C2]" />
                                    <span className="text-sm text-gray-400 group-hover:text-[#6A38C2]">
                                        {input.file ? input.file.name : 'Upload profile photo'}
                                    </span>
                                    <input type="file" accept="image/*" onChange={changeFileHandler} className="hidden" />
                                </label>
                            </div>

                            {loading ? (
                                <Button className="w-full rounded-xl py-5 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]">
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Creating account...
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full rounded-xl py-5 bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-semibold shadow-lg hover:scale-[1.02] transition-all duration-200">
                                    Create Account
                                </Button>
                            )}

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200 dark:border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-gray-50 dark:bg-gray-950 px-2 text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleGoogleLogin}
                                variant="outline"
                                className="w-full rounded-xl py-5 border-2 border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Google
                            </Button>

                            <p className='text-sm text-center text-gray-500 dark:text-gray-400'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-[#6A38C2] font-semibold hover:underline'>Sign In</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup