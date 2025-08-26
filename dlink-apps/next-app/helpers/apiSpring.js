import axios from "axios";
import { cookies } from "next/headers";

const apiSpring = axios.create({
    baseURL: process.env.SPRING_URI,
    headers: {
        "Content-Type": "application/json",
    },
});

apiSpring.interceptors.request.use(async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("springJwt")?.value;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiSpring;
