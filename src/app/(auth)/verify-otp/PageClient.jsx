"use client";

import CenteredAuthLayout from "@/components/CommonComponents/CenteredAuthLayout";
import OtpVerification from "@/components/VerifyOtp/OtpVerification";

import contoursBg from "@/assets/VerifyOtp/contours-bg.svg";

const page = () => {
    return (
        <CenteredAuthLayout contours={contoursBg}>
            <OtpVerification />
        </CenteredAuthLayout>
    );
};

export default page;
