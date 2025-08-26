//@ts-nocheck
import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Navbar,
    NavbarItem,
} from "@heroui/react";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import customSignOut from "@/helpers/signOut";
import { useSession } from "next-auth/react";

export const UserDropdown = () => {
    const { data: session } = useSession();

    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Avatar
                        as="button"
                        size="md"
                        src={session?.user?.image}
                        name={session?.user?.name}
                        showFallback
                    />
                </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu
                aria-label="User menu actions"
                onAction={(actionKey) => console.log({ actionKey })}
            >
                <DropdownItem
                    key="profile"
                    className="flex flex-col justify-start w-full items-start"
                >
                    <p>{session?.user.name}</p>
                    <p>{session?.user.email}</p>
                </DropdownItem>
                {/* <DropdownItem key='settings'>My Settings</DropdownItem> */}
                <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger"
                    onPress={() => customSignOut()}
                >
                    Log Out
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};
