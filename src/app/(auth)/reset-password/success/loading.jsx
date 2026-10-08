import { Shimmer, SkeletonLegalFooter } from "@/components/skeletons/SkeletonPrimitives";

export default function ResetPasswordSuccessLoading() {
    return (
        <div className="flex min-h-screen flex-1 flex-col bg-white">
            <div className="flex flex-1 justify-center px-4 pt-[clamp(3rem,24vh,15.625rem)] pb-16 sm:px-6">
                <div className="flex w-full max-w-[480px] flex-col items-center gap-4">
                    <Shimmer className="h-[154px] w-[220px]" rounded="rounded-2xl" />
                    <Shimmer className="mt-8 h-10 w-80" />
                    <Shimmer className="h-5 w-full" rounded="rounded-md" />
                    <Shimmer className="mt-2 h-14 w-full" rounded="rounded-[10px]" />
                </div>
            </div>
            <div className="mx-auto w-full max-w-[480px] px-4 pb-[26px] sm:px-0">
                <SkeletonLegalFooter />
            </div>
        </div>
    );
}
