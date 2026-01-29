import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample Maryland autism providers
const providers = [
  // Columbia, MD
  {
    practice_name: "Columbia Center for Speech & Language",
    city: "Columbia",
    state: "MD",
    phone: "(410) 730-0072",
    website: "https://www.columbiacentersl.com",
    description: "Speech and language therapy for children with autism",
    services: ["Speech-Language Therapy (SLT)"]
  },
  {
    practice_name: "Steppingstones Pediatric Therapy",
    city: "Columbia",
    state: "MD",
    phone: "(410) 740-1010",
    website: "https://www.steppingstonespediatrictherapy.com",
    description: "Occupational, physical, and speech therapy",
    services: ["Occupational Therapy (OT)", "Physical Therapy (PT)", "Speech-Language Therapy (SLT)"]
  },
  {
    practice_name: "Achieve Beyond Pediatric Therapy",
    city: "Columbia",
    state: "MD",
    phone: "(301) 970-2260",
    website: "https://www.achievebeyond.com",
    description: "ABA therapy and developmental services",
    services: ["Discrete Trial Training (DTT)", "Occupational Therapy (OT)"]
  },
  {
    practice_name: "The Behavior Exchange",
    city: "Columbia",
    state: "MD",
    phone: "(410) 872-7330",
    description: "Applied Behavior Analysis (ABA) therapy",
    services: ["Discrete Trial Training (DTT)"]
  },
  
  // Baltimore, MD
  {
    practice_name: "Kennedy Krieger Institute",
    city: "Baltimore",
    state: "MD",
    phone: "(443) 923-9200",
    website: "https://www.kennedykrieger.org",
    description: "Comprehensive autism evaluation and treatment",
    services: ["Discrete Trial Training (DTT)", "ESDM (Early Start Denver Model)", "Speech-Language Therapy (SLT)", "Occupational Therapy (OT)", "Physical Therapy (PT)"]
  },
  {
    practice_name: "Center for Autism and Related Disorders (CARD)",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 415-4000",
    website: "https://www.centerforautism.com",
    description: "ABA therapy programs",
    services: ["Discrete Trial Training (DTT)"]
  },
  {
    practice_name: "Springbrook Autism Behavioral Health",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 358-6400",
    website: "https://www.springbrookautism.org",
    description: "Behavioral health services for individuals with autism",
    services: ["Discrete Trial Training (DTT)", "Occupational Therapy (OT)"]
  },
  
  // Rockville, MD
  {
    practice_name: "The Ivymount School",
    city: "Rockville",
    state: "MD",
    phone: "(301) 469-0223",
    website: "https://www.ivymount.org",
    description: "Special education and therapy services",
    services: ["Speech-Language Therapy (SLT)", "Occupational Therapy (OT)", "Physical Therapy (PT)"]
  },
  {
    practice_name: "Building Blocks Pediatric Occupational Therapy",
    city: "Rockville",
    state: "MD",
    phone: "(301) 424-8992",
    website: "https://www.buildingblocksot.com",
    description: "Pediatric occupational therapy",
    services: ["Occupational Therapy (OT)"]
  },
  
  // Annapolis, MD
  {
    practice_name: "Annapolis Speech & Hearing",
    city: "Annapolis",
    state: "MD",
    phone: "(410) 224-1500",
    website: "https://www.annapolisspeech.com",
    description: "Speech and hearing services",
    services: ["Speech-Language Therapy (SLT)"]
  },
  {
    practice_name: "Little Hands OT",
    city: "Annapolis",
    state: "MD",
    phone: "(410) 571-6161",
    website: "https://www.littlehandsot.com",
    description: "Pediatric occupational therapy",
    services: ["Occupational Therapy (OT)"]
  },
  
  // Frederick, MD
  {
    practice_name: "Frederick Pediatric Therapy Center",
    city: "Frederick",
    state: "MD",
    phone: "(301) 620-2020",
    description: "Comprehensive pediatric therapy",
    services: ["Speech-Language Therapy (SLT)", "Occupational Therapy (OT)", "Physical Therapy (PT)"]
  },
  
  // Silver Spring, MD
  {
    practice_name: "Talk With Me Speech Therapy",
    city: "Silver Spring",
    state: "MD",
    phone: "(301) 588-0909",
    website: "https://www.talkwithmespeech.com",
    description: "Pediatric speech therapy",
    services: ["Speech-Language Therapy (SLT)"]
  },
  {
    practice_name: "ABA Therapies",
    city: "Silver Spring",
    state: "MD",
    phone: "(301) 587-2223",
    website: "https://www.abatherapies.com",
    description: "Applied Behavior Analysis",
    services: ["Discrete Trial Training (DTT)"]
  }
];

async function seedProviders() {
  console.log('Starting provider seed...');
  
  // First, get intervention category IDs
  const { data: interventions, error: intError } = await supabase
    .from('intervention_categories')
    .select('id, name');
  
  if (intError) {
    console.error('Error fetching interventions:', intError);
    return;
  }
  
  const interventionMap = new Map(
    interventions?.map(i => [i.name, i.id]) || []
  );
  
  console.log(`Found ${interventions?.length} intervention categories`);
  
  // Insert providers
  for (const provider of providers) {
    console.log(`\nInserting: ${provider.practice_name} (${provider.city})`);
    
    const { data: insertedProvider, error: provError } = await supabase
      .from('providers')
      .insert({
        practice_name: provider.practice_name,
        city: provider.city,
        state: provider.state,
        phone: provider.phone,
        website: provider.website,
        description: provider.description,
        verified: true,
        verified_date: new Date().toISOString()
      })
      .select()
      .single();
    
    if (provError) {
      console.error(`  Error inserting provider:`, provError.message);
      continue;
    }
    
    console.log(`  ✓ Provider inserted (ID: ${insertedProvider.id})`);
    
    // Link services
    for (const serviceName of provider.services) {
      const interventionId = interventionMap.get(serviceName);
      if (!interventionId) {
        console.warn(`  ⚠ Service not found: ${serviceName}`);
        continue;
      }
      
      const { error: serviceError } = await supabase
        .from('provider_services')
        .insert({
          provider_id: insertedProvider.id,
          intervention_id: interventionId
        });
      
      if (serviceError) {
        console.error(`  Error linking service ${serviceName}:`, serviceError.message);
      } else {
        console.log(`  ✓ Linked service: ${serviceName}`);
      }
    }
  }
  
  console.log('\n✅ Seed complete!');
}

seedProviders().catch(console.error);
