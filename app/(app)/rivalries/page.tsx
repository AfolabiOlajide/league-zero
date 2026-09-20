import { Swords } from "lucide-react";

import { FeatureEmptyState } from "@/components/feature-empty-state";

export default function RivalriesPage() {
  return (
    <FeatureEmptyState
      icon={Swords}
      eyebrow="Rivalries"
      title="No head-to-head record yet."
      description="Once a player accepts your request, every confirmed match between you will live here."
      action={{ href: "/search", label: "Find a rival" }}
    />
  );
}
