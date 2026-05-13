import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setFilters, clearFilters, setSearchedQuery } from '@/redux/jobSlice'
import { SlidersHorizontal, X } from 'lucide-react'

const filterData = [
    {
        key: "location",
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Remote"]
    },
    {
        key: "role",
        filterType: "Role",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer", "Data Science", "DevOps", "Design"]
    },
    {
        key: "jobType",
        filterType: "Job Type",
        array: ["Full-time", "Part-time", "Internship", "Contract"]
    },
    {
        key: "workMode",
        filterType: "Work Mode",
        array: ["Remote", "Hybrid", "On-site"]
    },
    {
        key: "source",
        filterType: "Source",
        array: ["Internal", "Unstop", "Arbeitnow", "JSearch"]
    },
];

const FilterCard = () => {
    const dispatch = useDispatch();
    // Safe default — filters may be undefined from old persisted state
    const filters = useSelector(store => store.job.filters) || {};

    const hasActiveFilters = Object.values(filters).some(v => v);

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ key, value }));
    };

    const handleClear = () => {
        dispatch(clearFilters());
        dispatch(setSearchedQuery(""));
    };

    return (
        <div className='w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden'>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#6A38C2]" />
                    <h2 className='font-bold text-gray-900 dark:text-white'>Filter Jobs</h2>
                    {hasActiveFilters && (
                        <span className="bg-[#6A38C2] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                            {Object.values(filters).filter(v => v).length}
                        </span>
                    )}
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={handleClear}
                        className="text-xs text-[#F83002] hover:text-[#c92502] font-semibold flex items-center gap-1 transition-colors"
                    >
                        <X className="w-3 h-3" /> Reset All
                    </button>
                )}
            </div>

            <div className="p-4 space-y-5">
                {filterData.map((section, index) => (
                    <div key={section.key}>
                        <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider mb-3'>
                            {section.filterType}
                            {filters[section.key] && (
                                <span className="ml-2 text-[#6A38C2] normal-case font-semibold">
                                    • {filters[section.key]}
                                </span>
                            )}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {section.array.map((item) => {
                                const isActive = filters[section.key] === item;
                                return (
                                    <button
                                        key={item}
                                        onClick={() => handleFilterChange(section.key, item)}
                                        className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all duration-200 ${
                                            isActive
                                                ? 'bg-[#6A38C2] border-[#6A38C2] text-white shadow-md shadow-[#6A38C2]/20'
                                                : 'bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-[#6A38C2] hover:text-[#6A38C2]'
                                        }`}
                                    >
                                        {item}
                                    </button>
                                );
                            })}
                        </div>
                        {index < filterData.length - 1 && (
                            <hr className="mt-5 border-gray-100 dark:border-white/10" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FilterCard