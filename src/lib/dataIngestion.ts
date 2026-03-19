import { supabase } from "./supabaseClient";

const DATA_GOV_KEY = process.env.DATA_GOV_IN_API_KEY;

export async function fetchFromDataGov(resourceId: string) {
  if (!DATA_GOV_KEY) {
    console.warn("Missing DATA_GOV_IN_API_KEY. Returning mock data.");
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.data.gov.in/resource/${resourceId}?api-key=${DATA_GOV_KEY}&format=json`
    );
    return await response.json();
  } catch (error) {
    console.error("Data.gov.in Fetch Error:", error);
    return null;
  }
}

export async function fetchLeaderFromWikipedia(leaderName: string) {
  try {
    const endpoint = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(leaderName)}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    
    return {
      name: data.title,
      summary: data.extract,
      thumbnail: data.originalimage?.source || data.thumbnail?.source,
      description: data.extract_html,
      sourceUrl: data.content_urls?.desktop?.page
    };
  } catch (error) {
    console.error("Wikipedia Fetch Error:", error);
    return null;
  }
}

export async function ingestBiharPilot() {
  // 1. Ensure Bihar exists
  const { data: state } = await supabase
    .from('states')
    .select('id')
    .eq('slug', 'bihar')
    .single();
    
  if (!state) throw new Error("Bihar state not found in DB. Run seed first.");

  // 2. Fetch/Update Leaders via Wikipedia
  const leadersToUpdate = ["Nitish Kumar", "Lalu Prasad Yadav", "Tejashwi Yadav"];
  
  for (const name of leadersToUpdate) {
    const wikiData = await fetchLeaderFromWikipedia(name);
    if (wikiData) {
      await supabase
        .from('leaders')
        .update({
          summary: wikiData.summary,
          thumbnail: wikiData.thumbnail,
          description: wikiData.description
        })
        .eq('name', name);
    }
  }

  return { message: "Bihar Pilot Ingestion Completed" };
}
