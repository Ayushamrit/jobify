import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        isLoading: false,
        // Multi-filter state: each key maps to a selected value string
        filters: {
            location: "",
            role: "",
            jobType: "",
            workMode: "",
            salary: "",
            source: "",
        },
    },
    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },
        setJobsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setFilters: (state, action) => {
            // action.payload: { key: string, value: string }
            const { key, value } = action.payload;
            // Toggle: clicking same value clears it
            state.filters[key] = state.filters[key] === value ? "" : value;
        },
        clearFilters: (state) => {
            state.filters = {
                location: "",
                role: "",
                jobType: "",
                workMode: "",
                salary: "",
                source: "",
            };
        },
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setJobsLoading,
    setFilters,
    clearFilters,
} = jobSlice.actions;

export default jobSlice.reducer;