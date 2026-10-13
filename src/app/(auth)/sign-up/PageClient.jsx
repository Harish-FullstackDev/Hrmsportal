"use client";

import AuthPageLayout from "@/components/CommonComponents/AuthPageLayout";
import CreateYourAccount from "@/components/SignUp/CreateYourAccount";

// Figma frame 1306:2517 (1440×800): the card starts 62 under the header and
// ends 57 above the page bottom (lower than the avatar strip beside it).
const page = () => {
    return (
        <AuthPageLayout topClassName="lg:pt-[62px]" cardClassName="lg:mb-[57px]">
            <CreateYourAccount />
        </AuthPageLayout>
    );
};

export default page;
