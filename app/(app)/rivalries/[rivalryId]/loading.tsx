import { Skeleton } from "@/components/ui/skeleton";

export default function RivalryLoading() {
  return <div className="mx-auto max-w-4xl animate-pulse"><Skeleton className="mx-auto h-5 w-16" /><div className="mt-8 grid grid-cols-3 items-center gap-5"><Skeleton className="h-24" /><Skeleton className="mx-auto size-12 rounded-full" /><Skeleton className="h-24" /></div><Skeleton className="mx-auto mt-8 h-12 w-40" /><Skeleton className="mt-10 h-28 w-full" /></div>;
}
