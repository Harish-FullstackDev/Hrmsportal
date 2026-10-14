import { Shimmer } from "@/components/skeletons/SkeletonPrimitives";

// Stage content only; the header, banner and stepper come from the layout.
export default function UploadResumeLoading() {
    return (
        <div className="flex w-full flex-col gap-3">
            <Shimmer className="h-6 w-40" rounded="rounded-md" />
            <Shimmer className="h-5 w-72" rounded="rounded-md" />
            <Shimmer className="h-[94px] w-full max-w-[548px]" />
        </div>
    );
}
