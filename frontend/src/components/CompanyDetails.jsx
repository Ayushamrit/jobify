import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { Button } from './ui/button'
import { MapPin, Globe, Users, Building2, Calendar, Star, ArrowLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import Job from './Job'
import { toast } from 'sonner'
import { Avatar, AvatarImage } from './ui/avatar'

const CompanyDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const [company, setCompany] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Review form state
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const REVIEW_API_END_POINT = "http://localhost:3000/api/v1/review";

    useEffect(() => {
        const fetchCompanyDetails = async () => {
            try {
                // Fetch Company
                const compRes = await axios.get(`${COMPANY_API_END_POINT}/get/${params.id}`, { withCredentials: true });
                if (compRes.data.success) {
                    setCompany(compRes.data.company);
                }

                // Fetch Jobs for this company (Filtering all jobs for now)
                const jobsRes = await axios.get(`${JOB_API_END_POINT}/get?keyword=`, { withCredentials: true });
                if (jobsRes.data.success) {
                    const companyJobs = jobsRes.data.jobs.filter(job => job.company?._id === params.id);
                    setJobs(companyJobs);
                }

                // Fetch Reviews
                const revRes = await axios.get(`${REVIEW_API_END_POINT}/${params.id}`, { withCredentials: true });
                if (revRes.data.success) {
                    setReviews(revRes.data.reviews);
                }

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompanyDetails();
    }, [params.id]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to submit a review");
            return;
        }
        setSubmitting(true);
        try {
            const res = await axios.post(`${REVIEW_API_END_POINT}/${params.id}`, { rating, reviewText }, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setReviews([res.data.review, ...reviews]); // Add new review to the top (mocked population)
                setReviewText("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
                <span className="text-xl font-bold text-gray-500 animate-pulse">Loading Company Profile...</span>
            </div>
        )
    }

    if (!company) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
                <Navbar />
                <div className="text-center py-24">
                    <h3 className="text-xl font-bold text-gray-700">Company Not Found</h3>
                </div>
            </div>
        )
    }

    // Calculate average rating
    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1) 
        : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Navbar />
            
            {/* Hero Section */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#6A38C2] mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            {company.logo ? (
                                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                            ) : (
                                <Building2 className="w-10 h-10 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{company.name}</h1>
                                {avgRating > 0 && (
                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg text-sm font-bold">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {avgRating}
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">{company.description || "No description provided."}</p>
                            
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                {company.location && (
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <MapPin className="w-4 h-4 text-[#6A38C2]" /> {company.location}
                                    </span>
                                )}
                                {company.industry && (
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Briefcase className="w-4 h-4 text-[#6A38C2]" /> {company.industry}
                                    </span>
                                )}
                                {company.employeeCount && (
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Users className="w-4 h-4 text-[#6A38C2]" /> {company.employeeCount} Employees
                                    </span>
                                )}
                                {company.foundedYear && (
                                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4 text-[#6A38C2]" /> Founded {company.foundedYear}
                                    </span>
                                )}
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#6A38C2] hover:underline">
                                        <Globe className="w-4 h-4" /> Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Jobs */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Open Jobs at {company.name}</h2>
                    {jobs.length === 0 ? (
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 text-center">
                            <p className="text-gray-500">There are currently no open jobs for this company.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {jobs.map(job => (
                                <Job key={job._id} job={job} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column: Reviews */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Leave a Review</h2>
                        <form onSubmit={submitReviewHandler} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Rating</label>
                                <div className="flex items-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <Star className={`w-6 h-6 ${rating >= star ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">Your Review</label>
                                <textarea 
                                    className="w-full rounded-xl p-3 border border-gray-200 dark:border-white/10 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#6A38C2]/50" 
                                    rows="4" 
                                    placeholder="What is it like to work here?"
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <Button type="submit" disabled={submitting} className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl">
                                {submitting ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews ({reviews.length})</h2>
                        {reviews.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No reviews yet. Be the first!</p>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="border-b border-gray-100 dark:border-white/10 pb-4 last:border-0 last:pb-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarImage src={review.user?.profile?.profilePhoto || "https://github.com/shadcn.png"} />
                                                </Avatar>
                                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {review.user?.fullname || "Anonymous"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-3 h-3 fill-yellow-500" />
                                                <span className="text-xs font-bold">{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{review.reviewText}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CompanyDetails
