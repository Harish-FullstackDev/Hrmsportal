import { SkeletonCenteredAuth } from "@/components/skeletons/SkeletonPrimitives";

export default function ResetPasswordLoading() {
    return <SkeletonCenteredAuth fields={2} />;
}
