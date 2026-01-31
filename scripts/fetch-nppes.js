const NPPES_API = 'https://npiregistry.cms.hhs.gov/api/';

// Autism-relevant specialty searches
const SEARCHES = [
  { term: 'behavior analyst', category: 'ABA Therapy' },
  { term: 'developmental pediatric', category: 'Developmental Pediatrics' },
  { term: 'psychiatr', category: 'Psychiatry' },
  { term: 'speech', category: 'Speech Therapy' },
  { term: 'occupational therap', category: 'Occupational Therapy' },
  { term: 'neuropsycholog', category: 'Neuropsychology' },
  { term: 'psycholog', category: 'Psychology' },
  { term: 'developmental disabil', category: 'Developmental Services' },
];

async function fetchProviders(searchTerm, category) {
  const providers = [];
  let skip = 0;
  const limit = 200;
  
  while (skip < 2000) { // Cap at 2000 per category
    const url = `${NPPES_API}?version=2.1&state=MD&taxonomy_description=${encodeURIComponent(searchTerm)}&limit=${limit}&skip=${skip}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) break;
      
      for (const r of data.results) {
        const addr = r.addresses?.find(a => a.address_purpose === 'LOCATION') || r.addresses?.[0];
        const taxonomy = r.taxonomies?.find(t => t.primary) || r.taxonomies?.[0];
        
        // Filter: only include if taxonomy seems autism-relevant
        const taxDesc = (taxonomy?.desc || '').toLowerCase();
        
        providers.push({
          npi: r.number,
          name: r.basic?.organization_name || `${r.basic?.first_name || ''} ${r.basic?.last_name || ''}`.trim(),
          credential: r.basic?.credential || '',
          specialty: taxonomy?.desc || category,
          category: category,
          phone: addr?.telephone_number?.replace(/[^\d]/g, '') || '',
          address: addr?.address_1 || '',
          address2: addr?.address_2 || '',
          city: addr?.city || '',
          state: addr?.state || 'MD',
          zip: addr?.postal_code?.substring(0, 5) || '',
          isOrganization: r.enumeration_type === 'NPI-2',
          enumerationDate: r.basic?.enumeration_date || ''
        });
      }
      
      if (data.results.length < limit) break;
      skip += limit;
      
      // Rate limit
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.error(`Error fetching ${searchTerm}:`, err.message);
      break;
    }
  }
  
  return providers;
}

async function main() {
  console.error('Fetching Maryland autism-related providers from NPPES...\n');
  
  let allProviders = [];
  
  for (const search of SEARCHES) {
    console.error(`Searching: "${search.term}" (${search.category})...`);
    const providers = await fetchProviders(search.term, search.category);
    console.error(`  Found: ${providers.length}\n`);
    allProviders = allProviders.concat(providers);
  }
  
  // Dedupe by NPI
  const seen = new Set();
  const unique = allProviders.filter(p => {
    if (seen.has(p.npi)) return false;
    seen.add(p.npi);
    return true;
  });
  
  // Sort by category, then name
  unique.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.name.localeCompare(b.name);
  });
  
  console.error(`\n========================================`);
  console.error(`Total unique providers: ${unique.length}`);
  console.error(`========================================\n`);
  
  // Output JSON
  console.log(JSON.stringify(unique, null, 2));
}

main();
