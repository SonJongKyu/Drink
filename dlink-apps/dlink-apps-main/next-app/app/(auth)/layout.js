import { AuthLayoutWrapper } from "@/components/auth/authLayout";
import "@/styles/globals.css";

export default function RootLayout({ children }) {
    return <AuthLayoutWrapper>{children}</AuthLayoutWrapper>;
}
