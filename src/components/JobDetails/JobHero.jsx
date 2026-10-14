import Image from "next/image";

import heroBg from "@/assets/JobDetails/hero-bg.png";
import statusDot from "@/assets/JobDetails/icons/status-dot-8.svg";

// Figma 1380:2956: full-bleed 200-tall banner under the header. Title block
// and chips sit 64 from the screen edge and 32 from the top; the photo
// covers the whole band.
export default function JobHero({ title, reference, status, tags }) {
    return (
        <section className="relative isolate w-full overflow-hidden">
            <Image src={heroBg} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
            <div className="flex w-full flex-col gap-4 px-4 py-8 sm:px-16 lg:h-[200px]">
                <div className="flex flex-col gap-1 capitalize">
                    <h1 className="text-[32px] leading-[1.2] font-medium text-white">{title}</h1>
                    <p className="text-base leading-[1.5] text-ink-disabled">{reference}</p>
                </div>
                <ul className="flex flex-wrap items-center gap-3 text-sm leading-5">
                    {/* Figma's stroke is inside the 32-tall chip, so 1 border + 5 padding. */}
                    <li className="flex items-center gap-1 rounded-md border border-info-500 bg-info-100 p-[5px] text-ink">
                        <Image src={statusDot} alt="" width={8} height={8} />
                        {status}
                    </li>
                    {tags.map((tag) => (
                        <li key={tag} className="rounded-md bg-[rgba(221,241,253,0.1)] p-1.5 text-white">
                            {tag}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
