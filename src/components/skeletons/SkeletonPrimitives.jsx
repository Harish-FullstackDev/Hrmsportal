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

// Shape of the login page: photo + brand panel on desktop, form on the right.
export function SkeletonLogin() {
    return (
        <div className="grid min-h-screen flex-1 bg-white lg:h-dvh lg:min-h-[45.6875rem] lg:grid-cols-2">
            <div className="hidden flex-col bg-navy-900 lg:flex">
                <div className="min-h-0 w-full flex-1 bg-slate-700/40" />
                <div className="flex flex-col gap-6 px-12 pt-11 pb-[4.3125rem]">
                    <div className="h-8 w-40 rounded-md bg-white/10" />
                    <div className="h-12 w-4/5 rounded-lg bg-white/10" />
                    <div className="h-12 w-3/5 rounded-lg bg-white/10" />
                    <div className="h-5 w-2/3 rounded-md bg-white/10" />
                </div>
            </div>
            <div className="flex flex-col items-center px-4 pt-16 pb-6 sm:px-12 lg:pt-[7rem]">
                <div className="flex w-full max-w-[30rem] flex-col gap-6 lg:pt-[5rem]">
                    <Shimmer className="mx-auto h-9 w-72" />
                    <SkeletonField inputClassName="h-[3.625rem]" />
                    <SkeletonField inputClassName="h-[3.625rem]" />
                    <Shimmer className="h-[3.5625rem] w-full" rounded="rounded-lg" />
                    <div className="grid grid-cols-2 gap-4">
                        <Shimmer className="h-[3.5625rem]" rounded="rounded-lg" />
                        <Shimmer className="h-[3.5625rem]" rounded="rounded-lg" />
                    </div>
                </div>
                <div className="flex flex-1 items-end pt-10">
                    <SkeletonLegalFooter />
                </div>
            </div>
        </div>
    );
}
