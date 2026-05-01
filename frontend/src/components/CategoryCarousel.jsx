import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { motion } from 'framer-motion';

const categories = [
    { label: "Frontend Developer", icon: "💻" },
    { label: "Backend Developer", icon: "⚙️" },
    { label: "Data Science", icon: "📊" },
    { label: "Graphic Designer", icon: "🎨" },
    { label: "FullStack Developer", icon: "🚀" },
    { label: "DevOps Engineer", icon: "🔧" },
    { label: "Mobile Developer", icon: "📱" },
    { label: "Product Manager", icon: "📋" },
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Browse by <span className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent">Category</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Explore thousands of jobs in your preferred field</p>
            </motion.div>

            <Carousel className="w-full max-w-4xl mx-auto">
                <CarouselContent className="-ml-2">
                    {categories.map((cat, index) => (
                        <CarouselItem key={index} className="pl-2 md:basis-1/3 lg:basis-1/4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => searchJobHandler(cat.label)}
                                className="w-full flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-gradient-to-br hover:from-[#6A38C2]/5 hover:to-[#8B5CF6]/10 hover:border-[#6A38C2]/30 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                            >
                                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{cat.icon}</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 text-center leading-tight group-hover:text-[#6A38C2] dark:group-hover:text-[#8B5CF6] transition-colors">
                                    {cat.label}
                                </span>
                            </motion.button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white" />
                <CarouselNext className="border-[#6A38C2] text-[#6A38C2] hover:bg-[#6A38C2] hover:text-white" />
            </Carousel>
        </section>
    )
}

export default CategoryCarousel