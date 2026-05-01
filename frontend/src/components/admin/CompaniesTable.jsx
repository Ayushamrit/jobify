import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Calendar, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCompany = companies.length >= 0 && companies.filter((company) => {
            if (!searchCompanyByText) {
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());

        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText])

    return (
        <div className="overflow-hidden">
            <Table>
                <TableCaption className="pb-4">A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logo</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Name</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date Created</TableHead>
                        <TableHead className="text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AnimatePresence>
                        {
                            filterCompany?.map((company, index) => (
                                <motion.tr
                                    key={company._id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="hover:bg-[#6A38C2]/5 dark:hover:bg-white/5 transition-colors group"
                                >
                                    <TableCell>
                                        <Avatar className="h-10 w-10 ring-2 ring-[#6A38C2]/10 group-hover:ring-[#6A38C2]/30 transition-all">
                                            <AvatarImage src={company.logo} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex items-center gap-2'>
                                            <Building2 className='w-4 h-4 text-[#6A38C2]' />
                                            <span className='font-semibold text-gray-900 dark:text-white text-sm'>{company.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-500 dark:text-gray-400">
                                        <div className='flex items-center gap-2'>
                                            <Calendar className='w-3.5 h-3.5' />
                                            {company.createdAt.split("T")[0]}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32 p-2 rounded-xl border-gray-100 dark:border-white/10 shadow-2xl">
                                                <button
                                                    onClick={() => navigate(`/admin/companies/${company._id}`)}
                                                    className='flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium transition-colors'
                                                >
                                                    <Edit2 className='w-4 h-4 text-[#6A38C2]' />
                                                    <span>Edit</span>
                                                </button>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </motion.tr>
                            ))
                        }
                    </AnimatePresence>
                </TableBody>
            </Table>
            {filterCompany?.length === 0 && (
                <div className='text-center py-10 text-gray-500 dark:text-gray-400'>
                    No companies found matching your search.
                </div>
            )}
        </div>
    )
}

export default CompaniesTable