"use client";

import AuthBackdrop from "@/components/CommonComponents/AuthBackdrop";
import PortalHeader from "@/components/CommonComponents/PortalHeader";
import JoinProfessionals from "@/components/SignIn/JoinProfessionals";
import MakeYourNextMove from "@/components/SignIn/MakeYourNextMove";
import SignInToYourAccount from "@/components/SignIn/SignInToYourAccount";

// Figma frame 1306:2565 (1440×800): the sign-in page is the landing page.
// All sizes are Figma's own px values, with 64 to the screen edges at every
// desktop width (no centred max-width). Desktop fills one screen: the
// headline and card both start 51 under the header, the avatar strip sits 68
// above the bottom, and the gap between them takes whatever height is left
// (74 at Figma's 800). On screens too short for that, only the bottom 68
// drops to 32; past that the page scrolls. Below lg it stacks and scrolls.
const page = () => {
    return (
        <div className="relative isolate flex min-h-dvh w-full flex-1 flex-col bg-white font-switzer text-ink">
            <AuthBackdrop />
            <PortalHeader />

            <main className="flex w-full flex-1 flex-col px-4 pt-10 pb-10 sm:px-16 lg:pt-[51px] lg:pb-[68px] lg:[@media(max-height:757px)]:pb-8">
                {/* Card's right edge is 136 from the frame edge: 64 padding + 72. */}
                <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-8 xl:pr-[72px]">
                    <MakeYourNextMove />
                    <SignInToYourAccount />
                </div>
                <div aria-hidden className="min-h-10 flex-1 lg:min-h-8" />
                <JoinProfessionals />
            </main>
        </div>
    );
};

export default page;
