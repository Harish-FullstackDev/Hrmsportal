"use client";

import { useState } from "react";
import Image from "next/image";

import stepCheck from "@/assets/Apply/icons/step-check.svg";
import { applySteps } from "@/components/Apply/applySteps";

// Time for the blue line to cross one connector.
const SEGMENT_MS = 400;

// Figma "Time line Slide bar" (1380:962, variants 1380:964...1380:1112): six
// 32px circles on a 4px rail, two-line labels centred under each. Steps
// before the current one turn blue with a check; the blue rail runs up to the
// current step. The rail is drawn as connectors between circles, so it always
// meets them whatever the label widths. Circles sit 32 in from the content
// edges so the outer labels stay inside. Below md the labels would collide,
// so only the current stage's name is shown under the circles.
//
// On a stage change the line moves one connector at a time, in travel order
// (6→5 retreats before 5→4; 4→5 fills before 5→6), so a jump of several
// stages reads as one continuous movement. Each circle and label changes
// colour as the line reaches (or leaves) it.
//
// Stages up to `maxVisited` (other than the current one) are buttons that
// call `onStepClick(index)`; later stages stay plain until reached.
export default function ApplicationStepper({ currentIndex, maxVisited = currentIndex, onStepClick }) {
    // The previous stage, derived when the current one changes, to time the
    // connectors in order.
    const [track, setTrack] = useState({ current: currentIndex, previous: currentIndex });
    if (track.current !== currentIndex) {
        setTrack({ current: currentIndex, previous: track.current });
    }
    const previous = track.previous;
    const forward = currentIndex > previous;
    const segments = Math.abs(currentIndex - previous);
    const easing = segments > 1 ? "linear" : "ease-out";

    // Connector `index` joins step index-1 to step index.
    const connectorDelay = (index) => {
        if (forward && index > previous && index <= currentIndex) return (index - previous - 1) * SEGMENT_MS;
        if (!forward && index > currentIndex && index <= previous) return (previous - index) * SEGMENT_MS;
        return 0;
    };
    // A circle changes once the line has finished arriving at / leaving it.
    const circleDelay = (index) => {
        if (forward && index > previous && index < currentIndex) return (index - previous) * SEGMENT_MS;
        if (!forward && index >= currentIndex && index < previous) return (previous - index) * SEGMENT_MS;
        return 0;
    };

    return (
        <nav aria-label="Application progress" className="w-full">
            <ol className="flex w-full items-start md:h-[92px] md:px-8">
                {applySteps.map(({ slug, label }, index) => {
                    const done = index < currentIndex;
                    const current = index === currentIndex;
                    const clickable = Boolean(onStepClick) && !current && index <= maxVisited;
                    const StepTag = clickable ? "button" : "div";
                    const delay = { transitionDelay: `${circleDelay(index)}ms` };

                    return (
                        <li key={slug} className={`flex items-start ${index > 0 ? "flex-1" : ""}`}>
                            {index > 0 && (
                                <span aria-hidden="true" className="relative mt-[14px] h-1 flex-1 bg-rail">
                                    <span
                                        className={`absolute inset-0 origin-left bg-action transition-transform motion-reduce:transition-none ${
                                            index <= currentIndex ? "scale-x-100" : "scale-x-0"
                                        }`}
                                        style={{
                                            transitionDuration: `${SEGMENT_MS}ms`,
                                            transitionTimingFunction: easing,
                                            transitionDelay: `${connectorDelay(index)}ms`,
                                        }}
                                    />
                                </span>
                            )}
                            <StepTag
                                {...(clickable
                                    ? {
                                          type: "button",
                                          onClick: () => onStepClick(index),
                                          "aria-label": `Go to ${label.replace("\n", " ")}`,
                                      }
                                    : {})}
                                className={`relative flex flex-col items-center rounded-full outline-offset-4 ${
                                    clickable ? "group cursor-pointer" : ""
                                }`}
                                aria-current={current ? "step" : undefined}
                            >
                                {/* The hover ring sits on its own layer so it never waits for the delays. */}
                                <span className="relative flex size-8 items-center justify-center rounded-full transition-shadow duration-200 group-hover:ring-4 group-hover:ring-primary-200/60">
                                    <span
                                        className={`absolute inset-0 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
                                            done ? "bg-action drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]" : "bg-surface-brand-subtle"
                                        }`}
                                        style={delay}
                                    />
                                    <span
                                        className={`relative text-sm leading-4 font-medium tracking-[0.7px] text-navy-900 transition-opacity duration-200 motion-reduce:transition-none ${
                                            done ? "opacity-0" : "opacity-100"
                                        }`}
                                        style={delay}
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
                                        style={delay}
                                    />
                                </span>
                                <span
                                    className={`absolute top-[38px] hidden h-12 w-max items-center text-center text-sm leading-[1.4] whitespace-pre-line transition-colors duration-300 md:flex ${
                                        done ? "text-action" : "text-ink"
                                    }`}
                                    style={delay}
                                >
                                    {label}
                                    {done && <span className="sr-only"> (completed)</span>}
                                </span>
                            </StepTag>
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
