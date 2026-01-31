const fs = require('fs');

const providers = JSON.parse(fs.readFileSync('data/nppes-providers.json', 'utf8'));

// Autism-relevant specialty patterns
const AUTISM_RELEVANT = [
  'behavior analyst',
  'behavior technician',
  'speech',
  'occupational therap',
  'child & adolescent psych',
  'clinical child',
  'developmental disabil',
  'developmental-behavioral',
  'neuropsycholog',
  'pediatric',
];

// Filter to most relevant
const filtered = providers.filter(p => {
  const spec = (p.specialty || '').toLowerCase();
  return AUTISM_RELEVANT.some(term => spec.includes(term));
});

// Assign service types
const withServices = filtered.map(p => {
  const spec = (p.specialty || '').toLowerCase();
  let services = [];
  
  if (spec.includes('behavior analyst') || spec.includes('behavior technician')) {
    services.push('ABA Therapy');
  }
  if (spec.includes('speech')) {
    services.push('Speech Therapy');
  }
  if (spec.includes('occupational')) {
    services.push('Occupational Therapy');
  }
  if (spec.includes('psychiatr')) {
    services.push('Psychiatry');
  }
  if (spec.includes('psycholog')) {
    services.push('Psychology');
  }
  if (spec.includes('developmental')) {
    services.push('Developmental Services');
  }
  if (spec.includes('neuropsycholog')) {
    services.push('Neuropsychology');
  }
  
  return { ...p, services };
});

console.error(`Filtered from ${providers.length} to ${withServices.length} autism-relevant providers`);
console.log(JSON.stringify(withServices, null, 2));
