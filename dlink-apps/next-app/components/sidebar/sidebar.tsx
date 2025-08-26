//@ts-nocheck
import React, { useEffect } from "react";
import { Sidebar } from "./sidebar.styles";
import { Avatar, Tooltip } from "@heroui/react";
import { CompaniesDropdown } from "./companies-dropdown";
import { HomeIcon } from "../icons/sidebar/home-icon";
import { PaymentsIcon } from "../icons/sidebar/payments-icon";
import { BalanceIcon } from "../icons/sidebar/balance-icon";
import { AccountsIcon } from "../icons/sidebar/accounts-icon";
import { CustomersIcon } from "../icons/sidebar/customers-icon";
import { ProductsIcon } from "../icons/sidebar/products-icon";
import { ReportsIcon } from "../icons/sidebar/reports-icon";
import { DevIcon } from "../icons/sidebar/dev-icon";
import { ViewIcon } from "../icons/sidebar/view-icon";
import { SettingsIcon } from "../icons/sidebar/settings-icon";
import { CollapseItems } from "./collapse-items";
import { SidebarItem } from "./sidebar-item";
import { SidebarMenu } from "./sidebar-menu";
import { FilterIcon } from "../icons/sidebar/filter-icon";
import { useSidebarContext } from "../layout/layout-context";
import { ChangeLogIcon } from "../icons/sidebar/changelog-icon";
import { usePathname } from "next/navigation";
// import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CocktailIcon } from "../icons/sidebar/cocktail-icon";
import { BookIcon } from "../icons/sidebar/book-icon";
import { WhiskeyIcon } from "../icons/sidebar/whiskey-icon";

export const SidebarWrapper = () => {
    const pathname = usePathname();
    const { collapsed, setCollapsed } = useSidebarContext();
    const { data: session } = useSession();

    return (
        <aside className="max-h-screen z-[20] sticky top-0">
            {collapsed ? (
                <div className={Sidebar.Overlay()} onClick={setCollapsed} />
            ) : null}
            <div
                className={Sidebar({
                    collapsed: collapsed,
                })}
            >
                <div className={Sidebar.Header()}>
                    <CompaniesDropdown />
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div className={Sidebar.Body()}>
                        <SidebarItem
                            title="Home"
                            icon={<HomeIcon />}
                            isActive={pathname === "/"}
                            href="/"
                        />
                        <SidebarMenu title="Alcohols">
                            <SidebarItem
                                isActive={pathname === "/categories/wine"}
                                title="와인"
                                icon={<CocktailIcon />}
                                href="/categories/wine"
                            />
                            <CollapseItems
                                href="/categories/yangju"
                                icon={<WhiskeyIcon />}
                                title="양주"
                                items={[
                                    "Gin",
                                    "Tequila",
                                    "Vodka",
                                    "Brandy",
                                    "Liqueur",
                                    "Whiskey",
                                    "Rum",
                                ]}
                            />
                        </SidebarMenu>
                        <SidebarMenu title="Highball">
                            <CollapseItems
                                href="/highballs"
                                icon={<BookIcon />}
                                items={[
                                    "Gin",
                                    "Tequila",
                                    "Vodka",
                                    "Brandy",
                                    "Liqueur",
                                    "Whiskey",
                                    "Rum",
                                ]}
                                title="하이볼 레시피"
                            />
                        </SidebarMenu>
                        {/* <SidebarMenu title="Links">
                            <SidebarItem
                                isActive={pathname === "/developers"}
                                title="Github"
                                icon={<DevIcon />}
                            />
                            <SidebarItem
                                isActive={pathname === "/developers"}
                                title="Notion"
                                icon={<ReportsIcon />}
                            />
                        </SidebarMenu> */}
                    </div>
                    <div className={Sidebar.Footer()}>
                        <Tooltip content="Settings" color="primary">
                            <div className="max-w-fit">
                                <SettingsIcon />
                            </div>
                        </Tooltip>
                        <Tooltip content={"Adjustments"} color="primary">
                            <div className="max-w-fit">
                                <FilterIcon />
                            </div>
                        </Tooltip>
                        <Tooltip content={"Profile"} color="primary">
                            <Avatar
                                as="button"
                                size="md"
                                src={session?.user?.image}
                                name={session?.user?.name}
                                showFallback
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>
        </aside>
    );
};
