const fs = require('fs');

// Load both datasets
const nppes = JSON.parse(fs.readFileSync('data/autism-providers.json', 'utf8'));
const investigational = JSON.parse(fs.readFileSync('data/investigational-providers.json', 'utf8'));

// Transform investigational to match nppes format
const invTransformed = investigational.map(p => ({
  npi: p.id,
  name: p.name,
  credential: '',
  specialty: p.description,
  category: p.category === 'HBOT' ? 'HBOT (Investigational)' :
            p.category === 'Stem Cell' ? 'Stem Cell (Investigational)' :
            p.category === 'Biomedical' ? 'Biomedical (Investigational)' :
            p.category === 'Research' ? 'Research Programs' :
            `${p.category} (Investigational)`,
  phone: p.phone,
  address: p.address,
  address2: '',
  city: p.city,
  state: p.state,
  zip: p.zip,
  isOrganization: true,
  services: [p.category],
  isInvestigational: true,
  evidenceLevel: p.evidenceLevel,
  notes: p.notes,
  website: p.website
}));

// Combine
const combined = [...nppes, ...invTransformed];

console.error(`NPPES providers: ${nppes.length}`);
console.error(`Investigational providers: ${invTransformed.length}`);
console.error(`Total combined: ${combined.length}`);

console.log(JSON.stringify(combined, null, 2));
