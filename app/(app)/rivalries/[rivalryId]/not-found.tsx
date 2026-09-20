import { ShieldQuestion } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RivalryNotFound() {
  return <section className="flex min-h-[65svh] items-center"><div className="max-w-lg"><ShieldQuestion aria-hidden="true" className="size-9 text-primary" /><h1 className="mt-5 text-3xl font-semibold tracking-[-0.04em]">This rivalry is unavailable.</h1><p className="mt-3 leading-7 text-muted-foreground">It may not exist, or it is private to another pair of players.</p><Link href="/rivalries" className={cn(buttonVariants({ size: "lg" }), "mt-7 h-11 px-5")}>View your rivalries</Link></div></section>;
}
