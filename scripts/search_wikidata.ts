import axios from 'axios';

async function searchWikidata(query: string) {
  const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json`;
  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'Bakaiti/1.0 (https://bakaiti.org; contact@bakaiti.org) axios/1.x'
    }
  });
  return response.data.search;
}

async function verify() {
  const leaders = ["Nitish Kumar", "Lalu Prasad Yadav", "Sushil Kumar Modi", "Tejashwi Yadav", "Rabri Devi"];
  for (const l of leaders) {
    const results = await searchWikidata(l);
    console.log(`Results for ${l}:`, JSON.stringify(results.slice(0, 3), null, 2));
  }
}

verify();
