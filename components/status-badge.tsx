import { CheckCircle2, Clock3, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { RivalryStatus } from "@/features/rivalries/types";

const statusContent: Record<RivalryStatus, { label: string; icon: typeof Clock3; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pending", icon: Clock3, variant: "secondary" },
  active: { label: "Active", icon: CheckCircle2, variant: "default" },
  rejected: { label: "Rejected", icon: XCircle, variant: "destructive" },
  cancelled: { label: "Cancelled", icon: XCircle, variant: "secondary" },
};

export function StatusBadge({ status }: { status: RivalryStatus }) {
  const { label, icon: Icon, variant } = statusContent[status];
  return <Badge variant={variant}><Icon aria-hidden="true" />{label}</Badge>;
}
