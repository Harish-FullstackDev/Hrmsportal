"use client";

import CenteredAuthLayout from "@/components/CommonComponents/CenteredAuthLayout";
import ResetYourPassword from "@/components/ForgotPassword/ResetYourPassword";

import contoursBg from "@/assets/ForgotPassword/contours-bg.svg";

const page = () => {
    return (
        <CenteredAuthLayout contours={contoursBg} fontClassName="font-sans" footerClassName="text-ink">
            <ResetYourPassword />
        </CenteredAuthLayout>
    );
};

export default page;
