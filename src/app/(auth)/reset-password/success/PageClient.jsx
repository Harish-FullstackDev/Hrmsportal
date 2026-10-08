"use client";

import CenteredAuthLayout from "@/components/CommonComponents/CenteredAuthLayout";
import PasswordChangedConfirmation from "@/components/ResetPasswordSuccess/PasswordChangedConfirmation";

import contoursBg from "@/assets/ResetPasswordSuccess/contours-bg.svg";

const page = () => {
    return (
        <CenteredAuthLayout contours={contoursBg}>
            <PasswordChangedConfirmation />
        </CenteredAuthLayout>
    );
};

export default page;
