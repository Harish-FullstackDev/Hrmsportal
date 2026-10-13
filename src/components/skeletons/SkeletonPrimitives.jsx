/**
 * Primitive skeleton atoms shared by every route's loading.jsx.
 * Zero dependencies beyond React and Tailwind CSS.
 */

// A single shimmering block. Pass width/height via className.
export function Shimmer({ className = "", rounded = "rounded-lg", style }) {
    return (
        <div
            className={`relative overflow-hidden bg-slate-100 ${rounded} ${className}`}
            style={style}
            aria-hidden="true"
        >
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        </div>
    );
}

// Label + input pair, matching the auth form fields.
export function SkeletonField({ inputClassName = "h-14" }) {
    return (
        <div className="flex flex-col gap-3">
            <Shimmer className="h-4 w-32" rounded="rounded-md" />
            <Shimmer className={`w-full ${inputClassName}`} rounded="rounded-[10px]" />
        </div>
    );
}

// Footer line under every auth screen.
export function SkeletonLegalFooter() {
    return (
        <div className="flex items-center gap-3" aria-hidden="true">
            <Shimmer className="h-3 w-48" rounded="rounded-md" />
            <Shimmer className="h-3 w-24" rounded="rounded-md" />
            <Shimmer className="h-3 w-20" rounded="rounded-md" />
        </div>
    );
}

// Shape of CenteredAuthLayout: logo mark, heading, description, then the
// screen's fields (or custom children) and the submit button.
export function SkeletonCenteredAuth({ fields = 1, children }) {
    return (
        <div className="flex min-h-screen flex-1 flex-col bg-white">
            <div className="flex flex-1 justify-center px-4 pt-[clamp(3rem,24vh,15.625rem)] pb-16 sm:px-6">
                <div className="flex w-full max-w-[480px] flex-col items-center gap-4">
                    <Shimmer className="h-10 w-12" rounded="rounded-md" />
                    <Shimmer className="mt-4 h-9 w-72" />
                    <Shimmer className="h-5 w-full" rounded="rounded-md" />
                    <Shimmer className="h-5 w-2/3" rounded="rounded-md" />
                    <div className="mt-6 flex w-full flex-col gap-6">
                        {children ??
                            Array.from({ length: fields }, (_, i) => <SkeletonField key={i} />)}
                        <Shimmer className="h-14 w-full" rounded="rounded-[10px]" />
                    </div>
                </div>
            </div>
            <div className="mx-auto w-full max-w-[480px] px-4 pb-[26px] sm:px-0">
                <SkeletonLegalFooter />
            </div>
        </div>
    );
}

// Shape of the sign-in page: header bar, headline on the left, card on the
// right, avatar strip at the bottom.
export function SkeletonLogin() {
    return (
        <div className="flex min-h-dvh flex-1 flex-col bg-white">
            <div className="border-b border-primary-200">
                <div className="flex w-full items-center justify-between px-4 pt-6 pb-4 sm:px-16 lg:pt-8 lg:pb-6">
                    <div className="flex gap-8">
                        <Shimmer className="h-6 w-24" rounded="rounded-md" />
                        <Shimmer className="h-6 w-28" rounded="rounded-md" />
                    </div>
                    <Shimmer className="h-8 w-40" rounded="rounded-md" />
                </div>
            </div>
            <div className="flex w-full flex-1 flex-col px-4 pt-10 pb-10 sm:px-16 lg:pt-[51px] lg:pb-[68px]">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between xl:pr-[72px]">
                    <div className="flex flex-col gap-3 lg:w-[462px]">
                        <Shimmer className="h-12 w-full" />
                        <Shimmer className="h-12 w-1/3" />
                        <Shimmer className="mt-5 h-5 w-11/12" rounded="rounded-md" />
                        <Shimmer className="h-5 w-1/2" rounded="rounded-md" />
                    </div>
                    <div className="flex w-full flex-col gap-6 rounded-2xl border border-[rgba(229,231,235,0.8)] p-8 lg:w-[520px]">
                        <Shimmer className="h-4 w-48" rounded="rounded-md" />
                        <Shimmer className="h-10 w-full" rounded="rounded-md" />
                        <SkeletonField inputClassName="h-[47.6px]" />
                        <SkeletonField inputClassName="h-[47.6px]" />
                        <Shimmer className="h-10 w-full" rounded="rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-1 items-end pt-10">
                    <Shimmer className="h-6 w-80" rounded="rounded-md" />
                </div>
            </div>
        </div>
    );
}
