import { Tooltip } from "antd";
import { appRoute } from "consts/routes.const";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface OptionProps {
    iconOn: string;
    iconOff: string;
    label: string;
    href: string;
    isCollapsed: boolean;
}

const Option: React.FC<OptionProps> = ({ iconOn, iconOff, label, href, isCollapsed }) => {
    const location = useLocation();
    const isActive =
        href === appRoute.admin.dashboard || href === appRoute.clients.dashboard
        ? location.pathname === href
        : location.pathname === href || location.pathname.startsWith(`${href}/`);

    return (
        <li
        className={`flex flex-row items-center p-1 md:py-2 rounded-lg md:h-11 justify-center md:justify-normal
            ${isActive ? "bg-primaryViking-300 text-neutrals-black" : "bg-transparent text-greys-700 hover:bg-primaryMariner-100" }
            ${isCollapsed ? "md:px-2" : "md:px-4"}
            transition-all duration-300 ease-in-out`}
        >
            <Tooltip title={isCollapsed ? label : ""} placement="right">
                <NavLink to={href} className="flex flex-col md:flex-row items-center gap-0" >
                    <div className="flex w-11 justify-center">
                        <img src={isActive ? iconOn : iconOff} alt={label} />
                    </div>
                    {!isCollapsed && (
                        <p className="pt-1 md:pl-3 md:py-2 rounded text-sm font-medium font-figtree transition-all duration-300 ease-in">{label}</p>
                    )}
                </NavLink>
            </Tooltip>
        </li>
    );
};

export default Option;
