"use client";

import CenteredAuthLayout from "@/components/CommonComponents/CenteredAuthLayout";
import UpdateYourPassword from "@/components/ResetPassword/UpdateYourPassword";

import contoursBg from "@/assets/ResetPassword/contours-bg.svg";

const page = () => {
    return (
        <CenteredAuthLayout contours={contoursBg}>
            <UpdateYourPassword />
        </CenteredAuthLayout>
    );
};

export default page;
