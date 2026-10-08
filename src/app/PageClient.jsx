"use client";

import EmpowerYourEmployees from "@/components/Login/EmpowerYourEmployees";
import LoginFirstToYourAccount from "@/components/Login/LoginFirstToYourAccount";

// Figma frame 57:4199 (1440×1024): the login page is the landing page.
// Sizes are rem against the frame, and data-figma-scale (globals.css) sizes
// rem so the whole frame fits one screen on desktop. 45.6875rem = 731 design
// px, the frame's minimum height; only below that does the page scroll.
const page = () => {
    return (
        <div
            data-figma-scale
            className="grid min-h-screen flex-1 bg-white lg:h-dvh lg:min-h-[45.6875rem] lg:grid-cols-2"
        >
            <EmpowerYourEmployees />
            <LoginFirstToYourAccount />
        </div>
    );
};

export default page;
