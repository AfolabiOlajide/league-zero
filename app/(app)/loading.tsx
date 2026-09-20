import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="space-y-10" aria-label="Loading page">
      <div className="space-y-3 border-b border-border pb-7">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-16 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-11 w-36" />
      </div>
    </div>
  );
}
