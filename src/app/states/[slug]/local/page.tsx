"use client";

import PlaceholderPage from "@/components/layout/PlaceholderPage";
import { useParams } from "next/navigation";

export default function StateLocalPoliticsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const stateName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : "State";

  return (
    <PlaceholderPage 
      title={`${stateName} Local Body Politics`}
      subtitle={`The grassroots record of ${stateName}. Municipal, Panchayat, and Ward-level archival data is being digitized for historical analysis.`}
      category="Local Governance Archive"
      backLink={`/states/${slug}`}
      backText={`Back to ${stateName} Hub`}
    />
  );
}
