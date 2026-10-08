import Image from "next/image";

import ascendusLogoMark from "@/assets/CommonComponents/ascendus-logo-mark.svg";

// Ascendus mark (icon only) used at the top of the single-column auth screens.
export default function LogoMark() {
    return (
        <div className="flex justify-center">
            <Image src={ascendusLogoMark} alt="Ascendus" priority />
        </div>
    );
}
