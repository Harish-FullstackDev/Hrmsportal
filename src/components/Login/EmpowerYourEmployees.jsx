import Image from "next/image";

import loginHero from "@/assets/Login/login-hero.webp";
import ascendusLogoFull from "@/assets/CommonComponents/ascendus-logo-full.svg";

// The photo box is 50vw wide and as tall as the screen allows, so its crop
// changes with screen height. Keep the faces where Figma has them, 150 design
// px (9.375rem) below the box top: the image renders 88.84vw tall (941×1672
// at 50vw) and the faces sit at 34.95% of it (31.05vw). At 1440×1024 this is
// Figma's centred crop. Clamped so the image never leaves a gap at the bottom
// (box height = page height − 21.1875rem brand block) or at the top.
const PHOTO_POSITION =
    "50% clamp(max(100dvh, 45.6875rem) - 21.1875rem - 88.84vw, 9.375rem - 31.05vw, 0px)";

// Figma 57:4201 "HRDashboard introduction": the left brand panel. Desktop only.
// Sizes are rem against the 1440 frame (1rem = 16 Figma px). The brand block
// keeps its Figma size; the photo takes the rest of the screen height, which
// is exactly Figma's 685px at 1440×1024.
export default function EmpowerYourEmployees() {
    return (
        <aside className="hidden min-h-0 flex-col bg-navy-900 lg:flex">
            <div className="relative min-h-0 w-full flex-1">
                <Image
                    src={loginHero}
                    alt="Colleagues working together in a bright office"
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover"
                    style={{ objectPosition: PHOTO_POSITION }}
                />
            </div>
            <div className="flex flex-col items-start gap-[1.625rem] pt-[2.6875rem] pr-[2.5rem] pb-[4.3125rem] pl-[3.0625rem] text-white">
                <Image src={ascendusLogoFull} alt="Ascendus Company" className="h-[2rem] w-[10.187rem]" />
                <h1 className="w-full max-w-[37.5rem] text-[3rem] leading-[3.625rem] font-semibold">
                    <span className="block">Let’s empower your</span>
                    <span className="block">employees today.</span>
                </h1>
                <p className="text-[1.0625rem] leading-[1.6875rem]">
                    We help to complete all your conveyancing needs easily
                </p>
            </div>
        </aside>
    );
}
