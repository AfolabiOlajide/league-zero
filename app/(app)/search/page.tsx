import { Search } from "lucide-react";

import { FeatureEmptyState } from "@/components/feature-empty-state";

export default function SearchPage() {
  return (
    <FeatureEmptyState
      icon={Search}
      eyebrow="Player search"
      title="Discovery is the next build unit."
      description="Your profile foundation is ready. Username search and rivalry requests arrive in the next feature specification."
    />
  );
}
