"use client";

import { addToast, Alert, Button, Image, Input } from "@heroui/react";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [error, setError] = useState("");
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const router = useRouter();

    const isValidEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setEmailError("");
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setPasswordError("");
    };

    const handleSubmit = async () => {
        let isValid = true;
        setError("");

        if (!email) {
            setEmailError("이메일을 입력해주세요.");
            isValid = false;
        } else if (!isValidEmail(email)) {
            setEmailError("올바른 이메일 형식을 입력해주세요.");
            isValid = false;
        }

        if (!password) {
            setPasswordError("비밀번호를 입력해주세요.");
            isValid = false;
        }

        if (!isValid) {
            setError("입력한 정보를 다시 확인해주세요.");
            return;
        }

        try {
            setIsLoginLoading(true);
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.ok) {
                router.push("/");
                return;
            }

            setError(result?.error || "로그인 실패");
            addToast({
                title: "로그인 실패",
                description: result?.error || "로그인 실패입니다!",
                color: "danger",
            });
        } catch (error) {
            console.error("로그인 오류:", error);
            setError("로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsLoginLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full md:w-1/2">
            <div className="text-center text-[25px] font-bold mb-6">로그인</div>

            <div className="flex flex-col gap-4">
                <Input
                    variant="bordered"
                    label="이메일"
                    type="email"
                    value={email}
                    isInvalid={!!emailError}
                    errorMessage={emailError}
                    onChange={handleEmailChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />

                <Input
                    variant="bordered"
                    label="비밀번호"
                    type="password"
                    value={password}
                    isInvalid={!!passwordError}
                    errorMessage={passwordError}
                    onChange={handlePasswordChange}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
            </div>

            <div className="flex justify-center mt-6">
                <Button
                    color="primary"
                    variant="flat"
                    onPress={handleSubmit}
                    isLoading={isLoginLoading}
                >
                    로그인
                </Button>
            </div>

            {/* 소셜 로그인 */}
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    SNS 계정으로 간편 로그인
                </p>
                <div className="flex justify-center gap-4 mt-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => signIn("google")}
                    >
                        <Image src="/google.svg" alt="Google" className="p-1" />
                    </Button>
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => signIn("kakao")}
                    >
                        <Image src="/kakao.svg" alt="Kakao" className="p-1" />
                    </Button>
                </div>
            </div>
            <div className="text-sm text-center text-gray-600 mt-4">
                계정이 없으신가요?
                <Button
                    as={Link}
                    href="/signup"
                    variant="light"
                    color="primary"
                    className="px-0"
                    disableAnimation
                >
                    회원가입
                </Button>
            </div>
        </div>
    );
}
