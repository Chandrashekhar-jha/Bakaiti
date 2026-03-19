"use client";

import PlaceholderPage from "@/components/layout/PlaceholderPage";
import { useParams } from "next/navigation";

export default function WardPoliticsPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const stateName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ') : "State";

  return (
    <PlaceholderPage 
      title={`${stateName} Ward-Level Power`}
      subtitle={`Exploring the hyper-local mandates of ${stateName}. Detailed ward-wise voting data and representative archives are being digitized.`}
      category="Hyper-local Archive"
      backLink={`/states/${slug}/local`}
      backText={`Back to Local Politics`}
    />
  );
}
