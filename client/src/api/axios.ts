import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
    withCredentials: true,
});

// Response interceptor for automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Call the refresh endpoint
                // Note: withCredentials ensures the refresh cookie is sent
                await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                // If successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, the user is truly logged out
                // We can optionally clear local state or redirect
                console.error("Session expired. Please log in again.");
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;