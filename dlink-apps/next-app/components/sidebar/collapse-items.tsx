"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "../icons/sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@heroui/react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

interface Props {
    icon: React.ReactNode;
    title: string;
    items: string[];
    href: string;
}

export const CollapseItems = ({ icon, items, title, href }: Props) => {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    const navigateToCategory = (item: string | null = null) => {
        router.push(href + '?subcategory=' + item?.toLocaleLowerCase());
    };

    return (
        <div className="flex gap-4 h-full items-center cursor-pointer">
            <Accordion className="px-0">
                <AccordionItem
                    indicator={<ChevronDownIcon />}
                    classNames={{
                        indicator: "data-[open=true]:-rotate-180",
                        trigger:
                            "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",

                        title: "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
                    }}
                    aria-label="Accordion 1"
                    title={
                        <div className="flex flex-row gap-2">
                            <span>{icon}</span>
                            <span>{title}</span>
                        </div>
                    }
                >
                    <div className="pl-12">
                        {items.map((item, index) => (
                            <span
                                key={index}
                                className="w-full flex text-default-500 hover:text-default-900 transition-colors"
                                onClick={() => navigateToCategory(item)}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
