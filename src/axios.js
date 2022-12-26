import axios from 'axios';

export const API_URL =
	process.env.API_URL || 'https://general-blog.onrender.com'; //'http://localhost:4444';

const instance = axios.create({
	baseURL: API_URL,
});

instance.interceptors.request.use((config) => {
	config.headers.Authorization = window.localStorage.getItem('token');
	return config;
});

export default instance;
