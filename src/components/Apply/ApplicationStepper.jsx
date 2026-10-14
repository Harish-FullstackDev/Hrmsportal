import Image from "next/image";

import stepCheck from "@/assets/Apply/icons/step-check.svg";
import { applySteps } from "@/components/Apply/applySteps";

// Figma "Time line Slide bar" (1380:962, variants 1380:964...1380:1112): six
// 32px circles on a 4px rail, two-line labels centred under each. Steps
// before the current one turn blue with a check; the blue rail runs up to the
// current step. The rail is drawn as connectors between circles, so it always
// meets them whatever the label widths. Circles sit 32 in from the content
// edges so the outer labels stay inside. Below md the labels would collide,
// so only the current stage's name is shown under the circles.
//
// On a stage change the blue fill grows (or shrinks) along each connector,
// circles fade to their new colour and the check pops in.
export default function ApplicationStepper({ currentIndex }) {
    return (
        <nav aria-label="Application progress" className="w-full">
            <ol className="flex w-full items-start md:h-[92px] md:px-8">
                {applySteps.map(({ slug, label }, index) => {
                    const done = index < currentIndex;
                    const current = index === currentIndex;

                    return (
                        <li key={slug} className={`flex items-start ${index > 0 ? "flex-1" : ""}`}>
                            {index > 0 && (
                                <span aria-hidden="true" className="relative mt-[14px] h-1 flex-1 bg-rail">
                                    <span
                                        className={`absolute inset-0 origin-left bg-action transition-transform duration-500 ease-out motion-reduce:transition-none ${
                                            index <= currentIndex ? "scale-x-100" : "scale-x-0"
                                        }`}
                                    />
                                </span>
                            )}
                            <div className="relative flex flex-col items-center" aria-current={current ? "step" : undefined}>
                                <span
                                    className={`flex size-8 items-center justify-center rounded-full transition-colors duration-300 ${
                                        done
                                            ? "bg-action drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                                            : "bg-surface-brand-subtle text-sm leading-4 font-medium tracking-[0.7px] text-navy-900"
                                    }`}
                                >
                                    {done ? (
                                        <Image
                                            src={stepCheck}
                                            alt=""
                                            width={10.87}
                                            height={8.02}
                                            className="motion-safe:animate-[apply-check-in_300ms_ease-out_both]"
                                        />
                                    ) : (
                                        index + 1
                                    )}
                                </span>
                                <span
                                    className={`absolute top-[38px] hidden h-12 w-max items-center text-center text-sm leading-[1.4] whitespace-pre-line transition-colors duration-300 md:flex ${
                                        done ? "text-action" : "text-ink"
                                    }`}
                                >
                                    {label}
                                    {done && <span className="sr-only"> (completed)</span>}
                                </span>
                            </div>
                        </li>
                    );
                })}
            </ol>
            <p className="mt-3 text-sm leading-5 text-ink md:hidden">
                Step {currentIndex + 1} of {applySteps.length}: {applySteps[currentIndex].label.replace("\n", " ")}
            </p>
        </nav>
    );
}
