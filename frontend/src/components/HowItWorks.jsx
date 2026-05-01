import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Search, Send, CheckCircle } from 'lucide-react'

const steps = [
    {
        icon: <UserPlus className="w-7 h-7" />,
        step: "01",
        title: "Create Your Profile",
        description: "Sign up in seconds, upload your resume, and tell us about your skills and experience.",
        color: "from-[#6A38C2] to-[#8B5CF6]",
        bgColor: "bg-[#6A38C2]/10",
        textColor: "text-[#6A38C2]"
    },
    {
        icon: <Search className="w-7 h-7" />,
        step: "02",
        title: "Search & Filter Jobs",
        description: "Browse thousands of curated jobs. Filter by location, salary, and industry to find the perfect match.",
        color: "from-[#F83002] to-[#FF6B4A]",
        bgColor: "bg-[#F83002]/10",
        textColor: "text-[#F83002]"
    },
    {
        icon: <Send className="w-7 h-7" />,
        step: "03",
        title: "Apply with One Click",
        description: "Apply instantly to any job. Track your application status and get hired by your dream company.",
        color: "from-emerald-500 to-teal-500",
        bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
        textColor: "text-emerald-600"
    },
];

const HowItWorks = () => {
    return (
        <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-14"
                >
                    <span className="inline-block bg-[#6A38C2]/10 text-[#6A38C2] text-sm font-semibold px-4 py-1.5 rounded-full mb-4">Simple Process</span>
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        How <span className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] bg-clip-text text-transparent">Jobify</span> Works
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                        Land your dream job in three simple steps. No complexity, just results.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting line (desktop) */}
                    <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-[#6A38C2] via-[#F83002] to-emerald-500 opacity-20" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="relative flex flex-col items-center text-center"
                        >
                            <div className={`w-20 h-20 rounded-2xl ${step.bgColor} flex items-center justify-center mb-5 relative shadow-sm`}>
                                <span className={step.textColor}>{step.icon}</span>
                                <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br ${step.color} text-white text-xs font-bold flex items-center justify-center shadow-lg`}>
                                    {step.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default HowItWorks
