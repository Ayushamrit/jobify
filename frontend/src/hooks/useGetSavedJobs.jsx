import { setSavedJobs } from '@/redux/jobSlice'
import { SAVED_JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetSavedJobs = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!user) return;
            try {
                const token = localStorage.getItem("jobify-token");
                const res = await axios.get(`${SAVED_JOB_API_END_POINT}/get`, { 
                    headers: { 'Authorization': `Bearer ${token}` },
                    withCredentials: true 
                });
                if (res.data.success) {
                    dispatch(setSavedJobs(res.data.savedJobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSavedJobs();
    }, [user, dispatch]);
}

export default useGetSavedJobs
