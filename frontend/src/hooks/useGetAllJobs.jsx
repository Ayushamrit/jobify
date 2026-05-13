import { setAllJobs, setJobsLoading } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                dispatch(setJobsLoading(true));

                // Use the same portals endpoint that works on the Portals page
                const res = await axios.get(
                    `${JOB_API_END_POINT}/portals?keyword=${encodeURIComponent(searchedQuery || '')}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                    const { unstop = [], arbeitnow = [], jsearch = [] } = res.data.jobs;

                    // Flatten all sources into one array, interleaved for variety
                    const flat = [];
                    const max = Math.max(unstop.length, arbeitnow.length, jsearch.length);
                    for (let i = 0; i < max; i++) {
                        if (unstop[i])    flat.push({ ...unstop[i],    source: 'Unstop' });
                        if (arbeitnow[i]) flat.push({ ...arbeitnow[i], source: 'Arbeitnow' });
                        if (jsearch[i])   flat.push({ ...jsearch[i],   source: 'JSearch' });
                    }

                    dispatch(setAllJobs(flat));
                }
            } catch (error) {
                console.error('useGetAllJobs error:', error);
            } finally {
                dispatch(setJobsLoading(false));
            }
        };

        fetchAllJobs();
    }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;