import React from 'react'

/**
 * Reusable pulsing skeleton card for job listings
 */
const JobSkeleton = () => (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-white/10 p-5 animate-pulse">
        {/* Company row */}
        <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 bg-gray-200 dark:bg-white/10 rounded-full w-2/3" />
                <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-1/3" />
            </div>
        </div>
        {/* Title */}
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded-full w-4/5 mb-3" />
        {/* Description lines */}
        <div className="space-y-2 mb-4">
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-full" />
            <div className="h-3 bg-gray-100 dark:bg-white/5 rounded-full w-5/6" />
        </div>
        {/* Tags */}
        <div className="flex gap-2 mb-4">
            <div className="h-6 w-16 bg-gray-100 dark:bg-white/5 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 dark:bg-white/5 rounded-full" />
            <div className="h-6 w-14 bg-gray-100 dark:bg-white/5 rounded-full" />
        </div>
        {/* Button */}
        <div className="h-9 bg-gray-200 dark:bg-white/10 rounded-xl w-full" />
    </div>
)

/**
 * Grid of skeleton cards shown while jobs are loading
 */
export const JobSkeletonGrid = ({ count = 6 }) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
            <JobSkeleton key={i} />
        ))}
    </div>
)

export default JobSkeleton
