import { Bell } from "lucide-react";

import { FeatureEmptyState } from "@/components/feature-empty-state";

export default function NotificationsPage() {
  return (
    <FeatureEmptyState
      icon={Bell}
      eyebrow="Notifications"
      title="Nothing needs your decision."
      description="Rivalry requests and result confirmations will appear here as the competition loop comes online."
    />
  );
}
