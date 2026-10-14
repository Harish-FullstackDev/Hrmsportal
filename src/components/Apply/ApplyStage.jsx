"use client";

import { useApplyDirection } from "@/components/Apply/ApplyShell";

// Full class strings so Tailwind picks them up; keyframes are in globals.css.
const stepAnimation = {
    next: "motion-safe:animate-[apply-step-in-next_450ms_cubic-bezier(0.22,1,0.36,1)_both]",
    back: "motion-safe:animate-[apply-step-in-back_450ms_cubic-bezier(0.22,1,0.36,1)_both]",
};

// Wraps a stage's content so it slides in from the side it comes from (right
// on Next, left on Back) while fading in. It sits inside the page rather than
// the layout, so the movement plays on the real content and not on the
// loading skeleton. Reduced-motion users get the change without movement.
export default function ApplyStage({ className = "", children }) {
    const direction = useApplyDirection();
    return <div className={`w-full ${stepAnimation[direction]} ${className}`}>{children}</div>;
}
