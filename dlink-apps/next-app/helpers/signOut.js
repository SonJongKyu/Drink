import { signOut } from "next-auth/react";
import axios from "axios";

export default async function customSignOut() {
    try {
        await signOut({ callbackUrl: "/" });
        await axios.delete("/api/v1/cookie", {}, { withCredentials: true });

    } catch (error) {
        console.error("로그아웃 실패:", error);
    }
}
