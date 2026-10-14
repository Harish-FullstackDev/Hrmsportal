import Image from "next/image";
import Link from "next/link";

import arrowRight from "@/assets/Apply/icons/arrow-right-muted-14.svg";
import infoIcon from "@/assets/Apply/icons/info-12.svg";

// Figma 1380:3135: required-fields notes on the left, Back / Next on the
// right (two 69-wide groups spread over 165). Back is Figma's arrow flipped.
// `onBack` runs before Back navigates (e.g. to keep the stage's entries).
export default function ApplyStepFooter({ backHref, onBack, onNext, nextLabel = "Next" }) {
    return (
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1 text-sm leading-5">
                <p className="text-[#44474d]">
                    The fields marked with an asterisk (<span className="text-[#ba1a1a]">*</span>) are required.
                </p>
                <p className="flex items-start gap-1 text-[rgba(68,71,77,0.8)]">
                    <Image src={infoIcon} alt="" width={11.67} height={11.67} className="mt-[4.17px] shrink-0" />
                    Please refrain from using special characters (e.g., parenthesis, slashes) in the legal name fields.
                </p>
            </div>

            <div className="flex w-[165px] shrink-0 items-center justify-between text-base leading-[1.5]">
                <Link href={backHref} onClick={onBack} className="flex w-[69px] items-center gap-2 text-muted-ink hover:text-ink">
                    <Image src={arrowRight} alt="" width={14} height={14} className="rotate-180" />
                    Back
                </Link>
                <button
                    type="button"
                    onClick={onNext}
                    className="flex w-[69px] cursor-pointer items-center gap-2 text-action hover:underline"
                >
                    {nextLabel}
                    <Image src={arrowRight} alt="" width={14} height={14} />
                </button>
            </div>
        </div>
    );
}
