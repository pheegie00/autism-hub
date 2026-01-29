import * as fs from 'fs';
import * as path from 'path';
const pdf = require('pdf-parse');

const PDF_PATH = '/home/ubuntu/.clawdbot/media/inbound/bb26c720-db29-4b76-bc19-cb5c08ed978a.pdf';
const OUTPUT_PATH = '/home/ubuntu/clawd/projects/autism-hub/data/extracted-providers.json';

interface ExtractedInfo {
  providers: Array<{
    name: string;
    type: string;
    location?: string;
    notes?: string;
  }>;
  treatments: Array<{
    name: string;
    category: string;
    evidenceLevel: string;
  }>;
  keywords: string[];
}

async function parsePDF() {
  console.log('Reading PDF...');
  const dataBuffer = fs.readFileSync(PDF_PATH);
  
  const data = await pdf(dataBuffer);
  const text = data.text;
  
  console.log(`PDF has ${data.numpages} pages`);
  console.log(`Extracted ${text.length} characters\n`);
  
  // Save full text for reference
  fs.writeFileSync(
    '/home/ubuntu/clawd/projects/autism-hub/data/pdf-full-text.txt',
    text
  );
  
  const extracted: ExtractedInfo = {
    providers: [],
    treatments: [],
    keywords: []
  };
  
  // Extract treatment categories
  const treatmentCategories = {
    'Table 1': 'Mainstream Evidence-Based',
    'Table 2': 'Investigational but Biologically Plausible',
    'Table 3': 'Low Cost, Low Risk Adjuncts',
    'Table 4': 'DANGEROUS - Avoid'
  };
  
  // Common treatment types to look for
  const treatmentPatterns = [
    /ABA|Applied Behavior Analysis|Discrete Trial Training|DTT/gi,
    /ESDM|Early Start Denver Model/gi,
    /Speech.*Therapy|SLT/gi,
    /Occupational.*Therapy|OT/gi,
    /Physical.*Therapy|PT/gi,
    /HBOT|Hyperbaric.*Oxygen/gi,
    /Leucovorin|Folinic.*Acid/gi,
    /Bumetanide/gi,
    /Oxytocin/gi,
    /CBD|Cannabidiol/gi,
    /Methylation/gi,
    /Microbiome|Probiotic/gi,
    /Stem.*Cell/gi,
    /Chelation/gi,
    /MMS|Chlorine.*Dioxide/gi
  ];
  
  // Extract treatments mentioned in text
  const lines = text.split('\n');
  for (const line of lines) {
    // Look for treatment mentions
    for (const pattern of treatmentPatterns) {
      const matches = line.match(pattern);
      if (matches) {
        for (const match of matches) {
          if (!extracted.keywords.includes(match.toLowerCase())) {
            extracted.keywords.push(match.toLowerCase());
          }
        }
      }
    }
    
    // Look for provider-like entries (names with addresses, phone numbers)
    // Pattern: Something followed by address-like text or phone
    if (line.match(/\d{3}[-.)]\d{3}[-.)]\d{4}/) || 
        line.match(/\b(MD|Maryland)\b/) ||
        line.match(/\b(Baltimore|Columbia|Annapolis|Rockville|Silver Spring)\b/i)) {
      
      // This might be a provider entry
      const providerMatch = line.match(/^([A-Z][^,\d]+?)(?:\s*[-–]\s*|\s{2,}|,\s*)/);
      if (providerMatch) {
        extracted.providers.push({
          name: providerMatch[1].trim(),
          type: 'potential-provider',
          notes: line.trim()
        });
      }
    }
  }
  
  // Remove duplicates
  extracted.keywords = [...new Set(extracted.keywords)];
  
  // Extract unique provider names
  const uniqueProviders = new Map<string, any>();
  for (const provider of extracted.providers) {
    if (!uniqueProviders.has(provider.name)) {
      uniqueProviders.set(provider.name, provider);
    }
  }
  extracted.providers = Array.from(uniqueProviders.values());
  
  console.log(`\nExtracted Data:`);
  console.log(`- Providers found: ${extracted.providers.length}`);
  console.log(`- Treatment keywords: ${extracted.keywords.length}`);
  console.log(`\nKeywords:`, extracted.keywords.slice(0, 20));
  console.log(`\nSample providers:`, extracted.providers.slice(0, 10).map(p => p.name));
  
  // Save extracted data
  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(extracted, null, 2));
  
  console.log(`\n✅ Data saved to ${OUTPUT_PATH}`);
  
  return extracted;
}

parsePDF().catch(console.error);
