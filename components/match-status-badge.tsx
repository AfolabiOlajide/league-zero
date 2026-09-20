import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MatchStatus } from "@/features/matches/types";

const content: Record<MatchStatus, { label: string; icon: typeof Clock3; variant: "default" | "secondary" | "destructive" }> = {
  pending: { label: "Pending verification", icon: Clock3, variant: "secondary" },
  accepted: { label: "Confirmed", icon: CheckCircle2, variant: "default" },
  rejected: { label: "Rejected", icon: XCircle, variant: "destructive" },
};

export function MatchStatusBadge({ status }: { status: MatchStatus }) {
  const { label, icon: Icon, variant } = content[status];
  return <Badge variant={variant}><Icon aria-hidden="true" />{label}</Badge>;
}
