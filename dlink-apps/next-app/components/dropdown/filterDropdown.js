// import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/react";
// import FunnelIcon from "@/components/icons/funnelicon";
// import { BottomIcon } from "../icons/sidebar/bottom-icon";
// import { AcmeIcon } from "../icons/acme-icon";


// const FilterDropdown = () => {
//     return (
//         <>
//             <Dropdown
//                 classNames={{
//                     base: "w-full min-w-[260px]",
//                 }}
//             >
//                 <DropdownTrigger className="cursor-pointer">
//                     <div className="flex items-center gap-2">
//                         {company.logo}
//                         <div className="flex flex-col gap-4">
//                             <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
//                                 {company.name}
//                             </h3>
//                             <span className="text-xs font-medium text-default-500">
//                                 {company.location}
//                             </span>
//                         </div>
//                         <BottomIcon />
//                     </div>
//                 </DropdownTrigger>
//                 <DropdownMenu aria-label="Avatar Actions">
//                     <DropdownSection title="Link">
//                         <DropdownItem
//                             key="1"
//                             startContent={<AcmeIcon />}
//                             description="ACS 7th"
//                             classNames={{
//                                 base: "py-4",
//                                 title: "text-base font-semibold",
//                             }}
//                         >
//                             Github
//                         </DropdownItem>
//                     </DropdownSection>
//                 </DropdownMenu>
//             </Dropdown>
//         </>
//     )
// }

// export default FilterDropdown;

import { Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from "@heroui/react";

const FilterDropdown = ({ title, options, selectedOption, onOptionChange, className = "" }) => {
    return (
        <Dropdown classNames={{ base: "w-full min-w-[160px] " + className }}>
            <DropdownTrigger className="cursor-pointer border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
                <span className="text-sm font-medium">{selectedOption || title}</span>
            </DropdownTrigger>
            <DropdownMenu aria-label={title}>
                <DropdownSection title={title}>
                    {options.map((option) => (
                        <DropdownItem
                            key={option.value}
                            onPress={() => onOptionChange(option.value)}
                            classNames={{ base: "py-2" }}
                        >
                            {option.label}
                        </DropdownItem>
                    ))}
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};

export default FilterDropdown;
