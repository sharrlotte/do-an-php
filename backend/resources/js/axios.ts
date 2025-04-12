import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
});

api.interceptors.response.use(
    (response) => {
        if (response.status >= 400) {
            throw new Error(response.data.message);
        }
        return response;
    },
    (error) => {
        if (error?.response?.data?.message) {
            throw new Error(error.response.data.message);
        }

        return Promise.reject(error);
    },
);

export { api };
