import { Shimmer, SkeletonCenteredAuth } from "@/components/skeletons/SkeletonPrimitives";

export default function VerifyOtpLoading() {
    return (
        <SkeletonCenteredAuth>
            <div className="flex gap-6">
                {[0, 1, 2, 3].map((i) => (
                    <Shimmer key={i} className="h-14 flex-1" rounded="rounded-[10px]" />
                ))}
            </div>
        </SkeletonCenteredAuth>
    );
}
