import { Bell, CheckCircle2, Clock3, XCircle } from "lucide-react";
import Link from "next/link";

import { FeatureEmptyState } from "@/components/feature-empty-state";
import { getNotificationsForUser } from "@/features/notifications/queries/notifications";
import { getCurrentAppUser } from "@/lib/auth/get-current-app-user";

const notificationCopy = {
  rivalry_requested: { text: "sent you a rivalry request.", icon: Clock3 },
  rivalry_accepted: { text: "accepted your rivalry request.", icon: CheckCircle2 },
  rivalry_rejected: { text: "rejected your rivalry request.", icon: XCircle },
  match_submitted: { text: "submitted a result for your decision.", icon: Clock3 },
  match_accepted: { text: "confirmed a match result.", icon: CheckCircle2 },
  match_rejected: { text: "rejected a match result.", icon: XCircle },
} as const;

export default async function NotificationsPage() {
  const user = await getCurrentAppUser();
  const notifications = user ? await getNotificationsForUser(user.id) : [];
  if (notifications.length === 0) {
    return <FeatureEmptyState icon={Bell} eyebrow="Notifications" title="Nothing needs your decision." description="Rivalry requests and result confirmations will appear here as the competition loop comes online." />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <header className="border-b border-border pb-7"><p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Notifications</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Competition updates</h1></header>
      <ul className="divide-y divide-border">
        {notifications.map((notification) => {
          const content = notificationCopy[notification.type];
          const Icon = content.icon;
          const href = notification.entityType === "rivalry" ? `/rivalries/${notification.entityId}` : "/rivalries";
          return <li key={notification.id}><Link href={href} className="flex gap-3 px-1 py-5 outline-none transition-colors hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50"><div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Icon aria-hidden="true" className="size-4" /></div><div className="min-w-0 flex-1"><p className="leading-6"><span className="font-semibold">{notification.actorName}</span> {content.text}</p><time className="mt-1 block text-sm text-muted-foreground" dateTime={notification.createdAt}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(notification.createdAt))}</time></div></Link></li>;
        })}
      </ul>
    </div>
  );
}
