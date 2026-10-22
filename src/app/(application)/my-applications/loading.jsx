import { SkeletonJobs } from "@/components/skeletons/SkeletonPrimitives";

// My Application: header and application cards.
export default function MyApplicationsLoading() {
    return <SkeletonJobs cards={2} />;
}
