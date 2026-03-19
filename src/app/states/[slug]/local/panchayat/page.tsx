"use client";

import PlaceholderPage from "@/components/layout/PlaceholderPage";
import { useParams } from "next/navigation";

export default function PanchayatPoliticsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const stateName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : "State";

  return (
    <PlaceholderPage 
      title={`${stateName} Panchayat Chronicles`}
      subtitle={`The grassroots record of rural ${stateName}. PRIs, Zila Parishads, and Block-level mandate data is being prepared.`}
      category="Rural Governance Archive"
      backLink={`/states/${slug}/local`}
      backText={`Back to Local Politics`}
    />
  );
}
