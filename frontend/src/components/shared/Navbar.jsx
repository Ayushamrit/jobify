import React, { useState, useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Moon, Sun, Bookmark, BriefcaseBusiness, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('jobify-theme') === 'dark');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('jobify-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('jobify-theme', 'light');
        }
    }, [darkMode]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Logout failed. Try again.');
        }
    }

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled
                ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg shadow-lg shadow-black/5 border-b border-gray-100 dark:border-white/10'
                : 'bg-white/60 dark:bg-gray-950/60 backdrop-blur-sm border-b border-transparent'
        }`}>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4 lg:px-6'>
                {/* Logo */}
                <Link to="/" className='flex items-center gap-2 group'>
                    <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-[#6A38C2] to-[#8B5CF6] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200'>
                        <BriefcaseBusiness className='w-4 h-4 text-white' />
                    </div>
                    <h1 className='text-xl font-bold tracking-tight'>
                        <span className='text-gray-900 dark:text-white'>Job</span>
                        <span className='bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent'>ify</span>
                    </h1>
                </Link>

                {/* Nav Links */}
                <div className='flex items-center gap-8'>
                    <ul className='hidden md:flex font-medium items-center gap-6'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <li><Link to="/admin/companies" className='nav-link'>Companies</Link></li>
                                <li><Link to="/admin/jobs" className='nav-link'>Jobs</Link></li>
                                <li><Link to="/admin/candidates" className='nav-link'>Candidates</Link></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/" className='nav-link'>Home</Link></li>
                                <li><Link to="/jobs" className='nav-link'>Jobs</Link></li>
                                <li><Link to="/browse" className='nav-link'>Browse</Link></li>
                                <li><Link to="/portals" className='nav-link'>Portals</Link></li>
                                {user && (
                                    <li><Link to="/saved" className='nav-link'>Saved</Link></li>
                                )}
                            </>
                        )}
                    </ul>

                    {/* Right Actions */}
                    <div className='flex items-center gap-3'>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className='w-9 h-9 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200'
                            aria-label="Toggle dark mode"
                        >
                            {darkMode ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
                        </button>

                        {!user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className='rounded-full border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white transition-all duration-200 font-semibold'>
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="rounded-full bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] text-white font-semibold shadow-lg hover:shadow-[#6A38C2]/30 transition-all duration-200">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer ring-2 ring-[#6A38C2]/30 hover:ring-[#6A38C2] transition-all duration-200 hover:scale-105">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 p-0 border-0 shadow-2xl rounded-2xl overflow-hidden dark:bg-gray-900">
                                    {/* Header */}
                                    <div className='bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] p-4'>
                                        <div className='flex gap-3 items-center'>
                                            <Avatar className="ring-2 ring-white/40">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-semibold text-white'>{user?.fullname}</h4>
                                                <p className='text-xs text-white/70'>{user?.profile?.bio || 'No bio added yet'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Menu Items */}
                                    <div className='p-3 flex flex-col gap-1'>
                                        {user && user.role === 'student' && (
                                            <Link to="/dashboard" className='flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors group'>
                                                <TrendingUp className='w-4 h-4 text-[#6A38C2]' />
                                                <span className='text-sm font-medium'>Dashboard</span>
                                            </Link>
                                        )}
                                        {user && user.role === 'student' && (
                                            <Link to="/profile" className='flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors group'>
                                                <User2 className='w-4 h-4 text-[#6A38C2]' />
                                                <span className='text-sm font-medium'>View Profile</span>
                                            </Link>
                                        )}
                                        {user && user.role === 'student' && (
                                            <Link to="/saved" className='flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200 transition-colors'>
                                                <Bookmark className='w-4 h-4 text-[#6A38C2]' />
                                                <span className='text-sm font-medium'>Saved Jobs</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={logoutHandler}
                                            className='flex w-full items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors'
                                        >
                                            <LogOut className='w-4 h-4' />
                                            <span className='text-sm font-medium'>Logout</span>
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Navbar