import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { SlidersHorizontal, X } from 'lucide-react'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Remote"]
    },
    {
        filterType: "Role",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "DevOps", "Design"]
    },
    {
        filterType: "Job Type",
        array: ["Full-time", "Part-time", "Internship", "Contract"]
    },
    {
        filterType: "Work Mode",
        array: ["Remote", "Hybrid", "On-site"]
    },
    {
        filterType: "Salary Range",
        array: ["0-40k", "40k-1L", "1L-5L", "5L+"]
    },
    {
        filterType: "Source",
        array: ["Internal", "Unstop", "Naukri", "Internshala", "JSearch", "Arbeitnow"]
    },
];

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(prev => prev === value ? '' : value);
    }

    const clearFilters = () => setSelectedValue('');

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <div className='w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden'>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#6A38C2]" />
                    <h2 className='font-bold text-gray-900 dark:text-white'>Filter Jobs</h2>
                </div>
                {selectedValue && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-[#F83002] hover:text-[#c92502] font-semibold flex items-center gap-1 transition-colors"
                    >
                        <X className="w-3 h-3" /> Clear
                    </button>
                )}
            </div>

            <div className="p-4 space-y-5">
                {filterData.map((section, index) => (
                    <div key={index}>
                        <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>{section.filterType}</h3>
                        <div className="flex flex-wrap gap-2">
                            {section.array.map((item, idx) => {
                                const isActive = selectedValue === item;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => changeHandler(item)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all duration-200 ${
                                            isActive
                                                ? 'bg-[#6A38C2] border-[#6A38C2] text-white shadow-md shadow-[#6A38C2]/20'
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2] dark:hover:text-[#8B5CF6]'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                )
                            })}
                        </div>
                        {index < filterData.length - 1 && (
                            <hr className="mt-5 border-gray-100 dark:border-white/10" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FilterCard