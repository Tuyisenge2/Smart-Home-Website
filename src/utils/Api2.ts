import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';

const ApiVer2: AxiosInstance = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}`, // Base URL from environment variable
	timeout: 50000, // Request timeout
});

// Request interceptor to modify requests before they are sent
ApiVer2.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		// Add authorization token if available
		const token = localStorage.getItem('auth_token');
	//	config.headers.Authorization = `Bearer eyJhbGciOiJIUzM4NCJ9.eyJyb2xlIjoiQURNSU4iLCJuYW1lIjoiVHV5aXNlbmdlIFRpdG8iLCJlbWFpbCI6InR1eWlzZW5nZXRpdG8zQGdtYWlsLmNvbSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLdDhSUFA3WDYxSUJRSWl3V1VhYkh1VzlYVUxwTlpPUHRfMTNlV3kxTFZKUjR0TFE9czk2LWMiLCJpYXQiOjE3NDYxOTk4NzcsImV4cCI6MTc0NzA2Mzg3N30.PyaLSn2ClJedI1u6dORwsUjpBpxyFN6nv8-B5tzTPLaMSFHEnVD4Ak3vEIUs3Iup`;

		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		// Handle request errors
		return Promise.reject(error);
	}
);

// Response interceptor to handle responses and errors
ApiVer2.interceptors.response.use(
	(response: AxiosResponse) => {
		// Return the response directly
		return response;
	},
	(error: AxiosError) => {
		// Handle specific error statuses
		if (error.response?.status === 401) {
			// Redirect to login if unauthorized
		//	localStorage.clear();
		//	window.location.href = '/login';
		}
		// Reject the error for further handling
		console.log("ACIASEEeeeeeeeeeeeeeeee",error)
		return Promise.reject(error);
	}
);

export default ApiVer2;