import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import HowItWorks from './HowItWorks'
import Testimonials from './Testimonials'
import BackToTop from './BackToTop'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <HowItWorks />
      <LatestJobs />
      <Testimonials />
      <Footer />
      <BackToTop />
    </div>
  )
}

export default Home