// @ts-nocheck
"use client";

import { Button, Input, addToast } from "@heroui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Formik } from "formik";

export const SignUp = () => {
    const router = useRouter();
    const [isRegLoading, setIsRegLoading] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isVerifyingCode, setIsVerifyingCode] = useState(false);

    const initialValues = {
        nickname: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validateEmail = (email) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(email);
    const validatePassword = (password) =>
        password.length >= 6 && /\d/.test(password);

    // 🔹 이메일 인증 코드 요청
    const handleSendVerificationEmail = async (email) => {
        if (!validateEmail(email)) {
            addToast({
                title: "올바르지 않은 이메일",
                description: "올바른 이메일 형식을 입력해주세요.",
                color: "danger",
            });
            return;
        }

        setIsSendingEmail(true);
        try {
            await axios.post("/api/v1/auth/email/send", { email });
            addToast({
                title: "인증 코드 전송",
                description: "이메일로 인증 코드가 전송되었습니다.",
                color: "success",
            });
            setEmailSent(true);
        } catch (err) {
            addToast({
                title: "이메일 전송 실패",
                description: err.response?.data?.message || "이메일 전송 중 오류 발생",
                color: "danger",
            });
        } finally {
            setIsSendingEmail(false);
        }
    };

    // 🔹 이메일 인증 코드 확인
    const handleVerifyEmail = async (email) => {
        setIsVerifyingCode(true);
        try {
            const response = await axios.post("/api/v1/auth/email/verify", {
                email,
                code: verificationCode,
            });

            if (response.data.verified) {
                addToast({
                    title: "이메일 인증 완료",
                    description: "이메일 인증이 정상적으로 완료되었습니다.",
                    color: "success",
                });
                setIsEmailVerified(true);
            } else {
                addToast({
                    title: "인증 실패",
                    description: "인증 코드가 올바르지 않습니다.",
                    color: "danger",
                });
            }
        } catch (err) {
            addToast({
                title: "인증 확인 오류",
                description: err.response?.data?.message || "이메일 인증 중 오류 발생",
                color: "danger",
            });
        } finally {
            setIsVerifyingCode(false);
        }
    };

    // 🔹 회원가입 요청
    const handleRegister = useCallback(
        async (values, { setErrors }) => {
            let errors = {};

            if (!values.nickname) errors.nickname = "닉네임을 입력해주세요.";
            if (!values.email) errors.email = "이메일을 입력해주세요.";
            else if (!validateEmail(values.email))
                errors.email = "올바른 이메일 형식을 입력해주세요.";
            if (!values.password) errors.password = "비밀번호를 입력해주세요.";
            else if (!validatePassword(values.password))
                errors.password = "비밀번호는 최소 6자 이상, 숫자를 포함해야 합니다.";
            if (values.password !== values.confirmPassword)
                errors.confirmPassword = "비밀번호가 일치하지 않습니다.";

            if (Object.keys(errors).length > 0) {
                setErrors(errors);
                return;
            }

            if (!isEmailVerified) {
                addToast({
                    title: "이메일 인증 필요",
                    description: "이메일 인증을 완료해주세요.",
                    color: "danger",
                });
                return;
            }

            setIsRegLoading(true);
            try {
                const response = await axios.post("/api/v1/auth/signup", {
                    name: values.nickname,
                    email: values.email,
                    password: values.password,
                });

                if (response.status === 201) {
                    addToast({
                        title: "회원가입 성공",
                        description: "회원가입이 완료되었습니다. 로그인해주세요.",
                        color: "success",
                    });
                    router.replace("/login");
                } else {
                    throw new Error(response.data.message || "회원가입 실패");
                }
            } catch (err) {
                addToast({
                    title: "회원가입 실패",
                    description: err.response?.data?.message || "회원가입 중 오류 발생",
                    color: "danger",
                });
            } finally {
                setIsRegLoading(false);
            }
        },
        [router, isEmailVerified]
    );

    return (
        <>
            <div className="text-center text-[25px] font-bold mb-6">
                회원가입
            </div>
            <Formik initialValues={initialValues} onSubmit={handleRegister}>
                {({ values, errors, touched, handleChange, handleSubmit }) => (
                    <div className="flex flex-col w-full lg:w-2/3 gap-4 mb-4">
                        <Input
                            variant="bordered"
                            label="닉네임"
                            type="text"
                            value={values.nickname}
                            isInvalid={!!errors.nickname && !!touched.nickname}
                            errorMessage={errors.nickname}
                            onChange={handleChange("nickname")}
                        />

                        {/* 🔹 이메일 입력 필드 + 인증 버튼 (오른쪽 고정) */}
                        <div className="relative w-full">
                            <Input
                                variant="bordered"
                                label="이메일"
                                type="email"
                                value={values.email}
                                isInvalid={!!errors.email && !!touched.email}
                                errorMessage={errors.email}
                                onChange={handleChange("email")}
                                className="pr-[120px]"
                            />
                            <Button
                                color="primary"
                                onPress={() =>
                                    handleSendVerificationEmail(values.email)
                                }
                                isLoading={isSendingEmail}
                                disabled={emailSent || isSendingEmail}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            >
                                {isSendingEmail ? "전송 중" : "인증번호 받기"}
                            </Button>
                        </div>

                        {emailSent && (
                            <div className="relative w-full">
                                <Input
                                    variant="bordered"
                                    label="인증 코드"
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) =>
                                        setVerificationCode(e.target.value)
                                    }
                                    className="pr-[100px]"
                                />
                                <Button
                                    color="primary"
                                    onPress={() =>
                                        handleVerifyEmail(values.email)
                                    }
                                    isLoading={isVerifyingCode}
                                    disabled={isEmailVerified || isVerifyingCode}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                >
                                   {isVerifyingCode ? "" : "인증 확인"}
                                </Button>
                            </div>
                        )}

                        <Input
                            variant="bordered"
                            label="비밀번호"
                            type="password"
                            value={values.password}
                            isInvalid={!!errors.password && !!touched.password}
                            errorMessage={errors.password}
                            onChange={handleChange("password")}
                        />
                        <Input
                            variant="bordered"
                            label="비밀번호 확인"
                            type="password"
                            value={values.confirmPassword}
                            isInvalid={
                                !!errors.confirmPassword &&
                                !!touched.confirmPassword
                            }
                            errorMessage={errors.confirmPassword}
                            onChange={handleChange("confirmPassword")}
                        />

                        <Button
                            color="primary"
                            isLoading={isRegLoading}
                            onPress={handleSubmit}
                            isDisabled={!isEmailVerified}
                        >
                            회원가입
                        </Button>
                    </div>
                )}
            </Formik>
        </>
    );
};
