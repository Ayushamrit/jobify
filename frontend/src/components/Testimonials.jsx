import React from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Frontend Developer",
        company: "at TechCorp India",
        avatar: "PS",
        color: "from-[#6A38C2] to-[#8B5CF6]",
        rating: 5,
        text: "Jobify helped me land my dream job in just 2 weeks! The UI is smooth, and filtering by skills made it super easy to find relevant opportunities. Highly recommend to every fresher!"
    },
    {
        name: "Rahul Verma",
        role: "Backend Engineer",
        company: "at StartupHub",
        avatar: "RV",
        color: "from-[#F83002] to-[#FF6B4A]",
        rating: 5,
        text: "As a recruiter, Jobify made it incredibly easy to post jobs and manage applicants. The applicant tracking dashboard is clean and saves so much time. 10/10 platform!"
    },
    {
        name: "Anjali Patel",
        role: "Data Scientist",
        company: "at Analytics Co.",
        avatar: "AP",
        color: "from-emerald-500 to-teal-500",
        rating: 5,
        text: "I applied to 15 jobs on Jobify and got 5 interviews within a month. The 'Save Job' feature is a lifesaver. The experience is so much better than other job portals."
    },
];

const Testimonials = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-6 py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-14"
            >
                <span className="inline-block bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">⭐ Success Stories</span>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Loved by <span className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent">Job Seekers</span>
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                    Real stories from people who found their dream jobs through Jobify.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((t, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/10 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Stars */}
                        <div className="flex gap-0.5 mb-4">
                            {Array.from({ length: t.rating }).map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                        </div>

                        {/* Review */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                                {t.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                                <p className="text-xs text-gray-400">{t.role} <span className="text-[#6A38C2]">{t.company}</span></p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials
