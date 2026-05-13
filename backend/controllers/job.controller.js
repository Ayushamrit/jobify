import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId, workMode, perks, applicationDeadline } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: typeof requirements === 'string' ? requirements.split(",") : requirements,
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
            workMode: workMode || 'On-site',
            perks: typeof perks === 'string' ? perks.split(",") : (perks || []),
            applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : undefined
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log("Error in postJob:", error);
        return res.status(500).json({
            message: "Failed to post job.",
            success: false,
            error: error.message
        });
    }
}

// Fetch from Arbeitnow API
const fetchArbeitnowJobs = async (keyword) => {
    try {
        const response = await fetch(`https://www.arbeitnow.com/api/job-board-api`);
        if (!response.ok) return [];
        const data = await response.json();
        const externalJobs = (data.data || []).map((item, index) => ({
            _id: `ext_an_${index}_${item.slug || index}`,
            title: item.title || "Untitled Job",
            description: item.description || "No description provided.",
            requirements: item.tags || [],
            salary: "N/A",
            experienceLevel: 0,
            location: item.location || "Remote",
            jobType: item.job_types?.[0] || "Full-time",
            position: 1,
            company: {
                _id: `comp_an_${index}`,
                name: item.company_name || "Unknown Company",
                logo: `https://www.google.com/s2/favicons?domain=${item.url}&sz=128`,
            },
            createdAt: new Date(item.created_at * 1000).toISOString(),
            isExternal: true,
            source: "Arbeitnow"
        }));

        if (keyword) {
            return externalJobs.filter(job => 
                job.title.toLowerCase().includes(keyword.toLowerCase()) || 
                job.description.toLowerCase().includes(keyword.toLowerCase())
            );
        }
        return externalJobs;
    } catch (error) {
        console.error("Arbeitnow API Error:", error.message);
        return [];
    }
};

// Fetch from Active Jobs DB (RapidAPI)
const fetchActiveJobsDB = async (keyword) => {
    try {
        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey || apiKey.includes("your_")) return [];

        const url = `https://active-jobs-db.p.rapidapi.com/active-ats-1h?offset=0&title_filter=${encodeURIComponent(`"${keyword || "Developer"}"`)}&location_filter=${encodeURIComponent('"India"')}&description_type=text`;
        
        const response = await fetch(url, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'active-jobs-db.p.rapidapi.com'
            }
        });
        if (!response.ok) return [];
        const data = await response.json();

        const jobs = Array.isArray(data) ? data : (data.results || []);

        return jobs.map((item, index) => ({
            _id: `ext_aj_${index}_${item.id || item.job_id || index}`,
            title: item.title || item.job_title || "Untitled Job",
            description: item.description || item.job_description || "No description provided.",
            requirements: item.tags || [item.category].filter(Boolean) || [],
            salary: item.salary || "N/A",
            experienceLevel: 0,
            location: item.location || "India",
            jobType: item.job_type || "Full-time",
            position: 1,
            company: {
                _id: `comp_aj_${index}`,
                name: item.company || item.company_name || "Unknown Company",
                logo: item.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.company || "C")}&background=random`,
            },
            createdAt: item.date_posted || new Date().toISOString(),
            isExternal: true,
            source: "Active Jobs"
        }));
    } catch (error) {
        console.error("Active Jobs DB API Error:", error.message);
        return [];
    }
};

// Fetch from JSearch (RapidAPI)
const fetchJSearchJobs = async (keyword) => {
    try {
        const apiKey = process.env.RAPIDAPI_KEY;
        if (!apiKey || apiKey.includes("your_")) return [];

        // Using search-v2 as requested
        const url = `https://jsearch.p.rapidapi.com/search-v2?query=${encodeURIComponent(`${keyword || "Developer"} in India`)}&num_pages=1&country=in&date_posted=all`;
        const response = await fetch(url, {
            headers: {
                'X-RapidAPI-Key': apiKey,
                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
            }
        });
        if (!response.ok) return [];
        const data = await response.json();

        const jobsArray = Array.isArray(data.data) ? data.data : [];

        return jobsArray.map((item) => ({
            _id: `ext_js_${item.job_id}`,
            title: item.job_title || "Untitled Job",
            description: item.job_description || "No description provided.",
            requirements: item.job_highlights?.Qualifications || [],
            salary: item.job_min_salary ? `${item.job_min_salary} - ${item.job_max_salary}` : "N/A",
            experienceLevel: item.job_required_experience?.required_experience_in_months / 12 || 0,
            location: `${item.job_city || ""}, ${item.job_country === 'IN' ? 'India' : (item.job_country || 'India')}`.replace(/^, /, ''),
            jobType: item.job_employment_type || "Full-time",
            position: 1,
            company: {
                _id: `comp_js_${item.employer_name}`,
                name: item.employer_name || "Unknown Company",
                logo: item.employer_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.employer_name || "C")}&background=random`,
            },
            createdAt: new Date(item.job_posted_at_datetime_utc || Date.now()).toISOString(),
            isExternal: true,
            source: "JSearch"
        }));
    } catch (error) {
        console.error("JSearch API Error:", error.message);
        return [];
    }
};

// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        let localJobs = [];
        try {
            localJobs = await Job.find(query).populate({
                path: "company"
            }).sort({ createdAt: -1 });
        } catch (dbError) {
            console.log("Database fetch failed, continuing with external APIs");
        }

        // Fetch from all external sources in parallel
        const [arbeitnowJobs, activeJobs, jsearchJobs] = await Promise.all([
            fetchArbeitnowJobs(keyword),
            fetchActiveJobsDB(keyword),
            fetchJSearchJobs(keyword)
        ]);

        // Filter for India only (except local jobs)
        const indiaArbeitnow = arbeitnowJobs.filter(job => job.location.toLowerCase().includes('india'));
        const indiaActiveJobs = activeJobs.filter(job => job.location.toLowerCase().includes('india'));
        const indiaJSearch = jsearchJobs.filter(job => job.location.toLowerCase().includes('india'));

        // Fetch Unstop jobs for main feed
        const unstopJobs = await fetchUnstopJobs(keyword);
        const indiaUnstop = unstopJobs.filter(job => job.location.toLowerCase().includes('india') || job.location === 'Remote');

        // Combine all jobs - interleave them for better mix
        const allJobs = [];
        const maxLength = Math.max(
            localJobs.length,
            indiaArbeitnow.length,
            indiaActiveJobs.length,
            indiaJSearch.length,
            indiaUnstop.length
        );

        for (let i = 0; i < maxLength; i++) {
            if (localJobs[i]) allJobs.push(localJobs[i]);
            if (indiaUnstop[i]) allJobs.push(indiaUnstop[i]);
            if (indiaJSearch[i]) allJobs.push(indiaJSearch[i]);
            if (indiaArbeitnow[i]) allJobs.push(indiaArbeitnow[i]);
            if (indiaActiveJobs[i]) allJobs.push(indiaActiveJobs[i]);
        }

        return res.status(200).json({
            jobs: allJobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        // Check which external source it belongs to
        if (jobId.startsWith('ext_')) {
            let job;
            if (jobId.startsWith('ext_an_')) {
                const externalJobs = await fetchArbeitnowJobs("");
                job = externalJobs.find(j => j._id === jobId);
            } else if (jobId.startsWith('ext_aj_')) {
                const externalJobs = await fetchActiveJobsDB("");
                job = externalJobs.find(j => j._id === jobId);
            } else if (jobId.startsWith('ext_js_')) {
                const externalJobs = await fetchJSearchJobs("");
                job = externalJobs.find(j => j._id === jobId);
            } else if (jobId.startsWith('ext_us_')) {
                const externalJobs = await fetchUnstopJobs("");
                job = externalJobs.find(j => j._id === jobId);
            }

            if (!job) {
                return res.status(404).json({
                    message: "Job not found.",
                    success: false
                })
            }
            return res.status(200).json({ job, success: true });
        }

        const job = await Job.findById(jobId).populate({
            path: "applications"
        }).populate({
            path: "company"
        });

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
}

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId })
            .populate({ path: 'company' })
            .sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Fetch jobs from Unstop public API
const fetchUnstopJobs = async (keyword) => {
    try {
        let url = `https://unstop.com/api/public/opportunity/search-result?opportunity=jobs&per_page=20&oppstatus=open`;
        if (keyword) {
            url += `&searchTerm=${encodeURIComponent(keyword)}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!response.ok) return [];
        const data = await response.json();
        const items = data?.data?.data || [];
        return items.map((item) => ({
            _id: `ext_us_${item.id}`,
            title: item.title || 'Untitled',
            description: item.details || item.description || item.short_description || 'No description.',
            requirements: item.required_skills?.map(s => s.skill_name) || [],
            salary: item.jobDetail?.show_salary ? `${item.jobDetail.min_salary || ''} - ${item.jobDetail.max_salary || ''} ${item.jobDetail.currency || ''}` : 'N/A',
            experienceLevel: 0,
            location: item.locations?.[0]?.city || item.location || 'India',
            jobType: item.jobDetail?.timing || 'Full-time',
            position: item.openings || 1,
            company: {
                _id: `comp_us_${item.organisation?.id || item.organization_id}`,
                name: item.organisation?.name || item.company_name || 'Unknown',
                logo: item.organisation?.logoUrl2 || item.logoUrl2
            },
            createdAt: item.approved_date || new Date().toISOString(),
            isExternal: true,
            source: 'Unstop',
            applyUrl: item.seo_url || `https://unstop.com/jobs/${item.public_url || item.id}`
        }));
    } catch (error) {
        console.error('Unstop API Error:', error.message);
        return [];
    }
};

// GET /api/v1/job/portals — returns jobs from external portals for the portals page
export const getPortalJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const source = req.query.source || 'all'; // all | unstop | jsearch | arbeitnow

        let results = {};

        const [unstopJobs, arbeitnowJobs, jsearchJobs] = await Promise.all([
            (source === 'all' || source === 'unstop') ? fetchUnstopJobs(keyword) : Promise.resolve([]),
            (source === 'all' || source === 'arbeitnow') ? fetchArbeitnowJobs(keyword) : Promise.resolve([]),
            (source === 'all' || source === 'jsearch') ? fetchJSearchJobs(keyword) : Promise.resolve([]),
        ]);

        results = {
            unstop: unstopJobs,
            arbeitnow: arbeitnowJobs.slice(0, 30),
            jsearch: jsearchJobs,
        };

        return res.status(200).json({
            jobs: results,
            success: true
        });
    } catch (error) {
        console.log('getPortalJobs error:', error);
        res.status(500).json({ message: 'Internal server error', success: false });
    }
};
