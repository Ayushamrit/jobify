const BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8000" 
    : (import.meta.env.VITE_BACKEND_URL || "https://jobify-backend-gpzo.onrender.com");

export const USER_API_END_POINT = `${BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${BASE_URL}/api/v1/company`;
export const PORTAL_API_END_POINT = `${BASE_URL}/api/v1/job/portals`;
export const AI_API_END_POINT = `${BASE_URL}/api/v1/ai`;
export const SAVED_JOB_API_END_POINT = `${BASE_URL}/api/v1/saved-job`;