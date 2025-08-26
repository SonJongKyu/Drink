import React from "react";

interface Props extends React.SVGAttributes<SVGElement> {}

export const CocktailIcon = () => {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="#969696"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
                {" "}
                <path
                    fill="#969696"
                    d="M19.1469 5H5.45312L12.3 11.125L19.1469 5Z"
                    stroke="none"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                ></path>{" "}
                <path
                    fill="#969696"
                    d="M12.3 18.25C11.8858 18.25 11.55 18.5858 11.55 19C11.55 19.4142 11.8858 19.75 12.3 19.75V18.25ZM17.4352 19.75C17.8494 19.75 18.1852 19.4142 18.1852 19C18.1852 18.5858 17.8494 18.25 17.4352 18.25V19.75ZM11.55 19C11.55 19.4142 11.8858 19.75 12.3 19.75C12.7142 19.75 13.05 19.4142 13.05 19H11.55ZM13.05 11.125C13.05 10.7108 12.7142 10.375 12.3 10.375C11.8858 10.375 11.55 10.7108 11.55 11.125H13.05ZM12.3 19.75C12.7142 19.75 13.05 19.4142 13.05 19C13.05 18.5858 12.7142 18.25 12.3 18.25V19.75ZM7.16486 18.25C6.75064 18.25 6.41486 18.5858 6.41486 19C6.41486 19.4142 6.75064 19.75 7.16486 19.75V18.25ZM12.3 19.75H17.4352V18.25H12.3V19.75ZM13.05 19V11.125H11.55V19H13.05ZM12.3 18.25H7.16486V19.75H12.3V18.25Z"
                ></path>{" "}
            </g>
        </svg>
    );
};
