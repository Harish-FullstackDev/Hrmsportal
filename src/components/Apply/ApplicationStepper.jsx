"use client";

import Image from "next/image";

import stepCheck from "@/assets/Apply/icons/step-check.svg";
import { applySteps } from "@/components/Apply/applySteps";

// Figma 1878:19594: a 100-tall light-blue panel (12 radius, 32/16 padding)
// with the six stages in equal columns, each a 32px white circle over its
// 14px label, 16 apart. A 3px light rail joins the circles; the blue part
// runs up to the current stage and slides along when it changes. The current
// stage's circle has a blue ring; stages before it turn blue with a check
// and a blue label. Below xl the labels would collide, so only the current
// stage's name is shown under the circles.
//
// Stages up to `maxVisited` (other than the current one) are buttons that
// call `onStepClick(index)`; later stages stay plain until reached.
export default function ApplicationStepper({ currentIndex, maxVisited = currentIndex, onStepClick }) {
    const count = applySteps.length;
    // Circle centres sit in the middle of equal columns.
    const centre = (index) => `${((index + 0.5) / count) * 100}%`;
    const filledTo = Math.min(currentIndex, count - 1);

    return (
        <nav aria-label="Application progress" className="w-full">
            <div className="relative rounded-xl bg-surface-brand-subtle px-2 py-4 lg:h-[100px] lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-2 top-[30.5px] lg:inset-x-8">
                    <span
                        className="absolute h-[3px] rounded-full bg-[#8bb0da]"
                        style={{ left: centre(0), right: centre(0) }}
                    />
                    <span
                        className="absolute h-[3px] rounded-full bg-action transition-[width] duration-500 ease-out motion-reduce:transition-none"
                        style={{ left: centre(0), width: `${(filledTo / count) * 100}%` }}
                    />
                </div>
                <ol className="relative flex w-full items-start">
                    {applySteps.map(({ slug, label }, index) => {
                        const done = index < currentIndex;
                        const current = index === currentIndex;
                        const clickable = Boolean(onStepClick) && !current && index <= maxVisited;
                        const StepTag = clickable ? "button" : "div";

                        return (
                            <li key={slug} className="flex flex-1 justify-center">
                                <StepTag
                                    {...(clickable
                                        ? { type: "button", onClick: () => onStepClick(index), "aria-label": `Go to ${label}` }
                                        : {})}
                                    className={`flex flex-col items-center gap-4 rounded-lg outline-offset-4 ${
                                        clickable ? "group cursor-pointer" : ""
                                    }`}
                                    aria-current={current ? "step" : undefined}
                                >
                                    <span
                                        className={`relative flex size-8 items-center justify-center rounded-full border transition-[background-color,border-color,box-shadow] duration-300 group-hover:ring-4 group-hover:ring-primary-200/60 motion-reduce:transition-none ${
                                            done
                                                ? "border-action bg-action drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]"
                                                : current
                                                  ? "border-action bg-white"
                                                  : "border-transparent bg-white"
                                        }`}
                                    >
                                        <span
                                            className={`text-sm leading-4 font-medium tracking-[0.7px] text-navy-900 transition-opacity duration-200 motion-reduce:transition-none ${
                                                done ? "opacity-0" : "opacity-100"
                                            }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <Image
                                            src={stepCheck}
                                            alt=""
                                            width={10.87}
                                            height={8.02}
                                            className={`absolute transition-[opacity,scale] duration-300 motion-reduce:transition-none ${
                                                done ? "scale-100 opacity-100" : "scale-50 opacity-0"
                                            }`}
                                        />
                                    </span>
                                    <span
                                        className={`hidden text-center text-sm leading-[1.4] whitespace-nowrap transition-colors duration-300 xl:block ${
                                            done ? "text-action" : "text-ink"
                                        }`}
                                    >
                                        {label}
                                        {done && <span className="sr-only"> (completed)</span>}
                                    </span>
                                </StepTag>
                            </li>
                        );
                    })}
                </ol>
            </div>
            <p className="mt-3 text-sm leading-5 text-ink xl:hidden">
                {currentIndex >= count
                    ? "All steps completed"
                    : `Step ${currentIndex + 1} of ${count}: ${applySteps[currentIndex].label}`}
            </p>
        </nav>
    );
}
