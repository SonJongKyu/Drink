//@ts-nocheck
"use client";

import {
    Input,
    Navbar,
    NavbarContent,
    Button,
    Divider,
    Spinner,
} from "@heroui/react";
import React from "react";
import { useSession } from "next-auth/react";
import { BurguerButton } from "./burguer-button";
import { DarkModeSwitch } from "./darkmodeswitch";
import Link from "next/link";
import UserIcon from "../icons/userIcon";
import LoginIcon from "../icons/loginIcon";
import { UserDropdown } from "./user-dropdown";

interface Props {
    children: React.ReactNode;
}

export const NavbarWrapper = ({ children }: Props) => {
    const { data: session, status } = useSession();

    return (
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Navbar
                isBordered
                className="bg-primary"
                classNames={{ wrapper: "w-full max-w-full" }}
            >
                <NavbarContent className="md:hidden">
                    <BurguerButton />
                </NavbarContent>

                <NavbarContent justify="end">
                </NavbarContent>

                <NavbarContent
                    justify="end"
                    className="w-fit data-[justify=end]:flex-grow-0"
                >
                    {status === "loading" ? (
                        <Spinner size="sm" color="white" />
                    ) : status === "authenticated" ? (
                        <UserDropdown />
                    ) : (
                        <>
                            <Button
                                as={Link}
                                href="/login"
                                variant="light"
                                startContent={<LoginIcon />}
                                className="px-0 text-white"
                            >
                                Login
                            </Button>
                            <Divider orientation="vertical" className="h-6" />
                            <Button
                                as={Link}
                                href="/signup"
                                variant="light"
                                startContent={<UserIcon />}
                                className="px-0 text-white"
                            >
                                Sign up
                            </Button>
                        </>
                    )}
                </NavbarContent>
            </Navbar>
            {children}
        </div>
    );
};
