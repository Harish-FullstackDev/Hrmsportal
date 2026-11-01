"use client";

import Image from "next/image";
import Link from "next/link";

import ascendusMark from "@/assets/HrShell/ascendus-mark.svg";
import calendarIcon from "@/assets/HrShell/icons/calendar-12x13.svg";
import chevronDownIcon from "@/assets/HrShell/icons/chevron-down-7.svg";
import helpIcon from "@/assets/HrShell/icons/help-24.svg";
import menuIcon from "@/assets/HrShell/icons/menu-24.svg";
import notificationIcon from "@/assets/HrShell/icons/notification-24.svg";
import profileIcon from "@/assets/HrShell/icons/profile-24.svg";

const ICON_BUTTONS = [
    { label: "Help", icon: helpIcon },
    { label: "Profile", icon: profileIcon },
    { label: "Notifications", icon: notificationIcon },
];

// Figma 1898:5289: the HR top bar. 12 of space above a 71 tall bar. With the
// sidebar closed it starts with the Menu button and the Ascendus mark; with
// it open (Figma 1905:1304) the sidebar carries the logo, so from lg they hide.
export default function HrTopBar({ sidebarOpen, onOpenSidebar }) {
    return (
        <header className="sticky top-0 z-30 bg-white pt-3 drop-shadow-[-2px_2px_1.3px_rgba(0,0,0,0.15)]">
            <div className="flex h-[71px] items-center gap-4 px-4 sm:gap-6 sm:px-8">
                <div className={`flex shrink-0 items-center gap-6 ${sidebarOpen ? "lg:hidden" : ""}`}>
                    <div className="flex h-14 items-center border-r-[0.5px] border-border-strong pr-4 sm:w-[82px] sm:pr-0">
                        <button
                            type="button"
                            onClick={onOpenSidebar}
                            aria-expanded={sidebarOpen}
                            aria-controls="hr-sidebar"
                            className="flex items-center gap-2 rounded text-xs leading-[1.4] text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                        >
                            <Image src={menuIcon} alt="" className="size-6" />
                            Menu
                        </button>
                    </div>
                    <Link href="/hr/dashboard" aria-label="Ascendus Company, dashboard">
                        <Image src={ascendusMark} alt="" priority className="h-6 w-[30px]" />
                    </Link>
                </div>

                <div className="flex min-w-0 flex-1 items-center justify-end gap-6 md:justify-between">
                    <label className="hidden h-10 min-w-0 flex-1 items-center rounded bg-surface-brand-subtle px-4 md:flex md:max-w-[630px]">
                        <span className="sr-only">Search</span>
                        <input
                            type="search"
                            placeholder="Search Jobs, Candidate, roles, etc..."
                            className="w-full min-w-0 bg-transparent text-xs leading-[1.4] text-ink placeholder:text-ink focus:outline-none"
                        />
                    </label>

                    <div className="flex shrink-0 items-center gap-6">
                        {/* The period options aren't designed yet. */}
                        <button
                            type="button"
                            className="hidden h-10 w-[142px] items-center gap-1 rounded bg-surface-tint px-2 text-xs leading-[1.4] text-ink-body lg:flex"
                        >
                            <Image src={calendarIcon} alt="" className="h-[13.333px] w-3" />
                            This Quarter (Q3)
                            <Image src={chevronDownIcon} alt="" className="h-[4.317px] w-[7px]" />
                        </button>
                        <div className="flex items-center gap-2">
                            {ICON_BUTTONS.map(({ label, icon }) => (
                                <button
                                    key={label}
                                    type="button"
                                    aria-label={label}
                                    className="flex size-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action"
                                >
                                    <Image src={icon} alt="" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
