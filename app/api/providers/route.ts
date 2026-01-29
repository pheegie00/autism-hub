import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { searchAutismProviders, mapGoogleProviderToOurFormat } from '@/lib/google-places';

// Sample providers as fallback when database is empty
const SAMPLE_PROVIDERS = [
  {
    id: 1,
    practice_name: "Columbia Center for Speech & Language",
    city: "Columbia",
    state: "MD",
    phone: "(410) 730-0072",
    website: "https://www.columbiacentersl.com",
    description: "Speech and language therapy for children with autism",
    provider_services: [
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 2,
    practice_name: "Steppingstones Pediatric Therapy",
    city: "Columbia",
    state: "MD",
    phone: "(410) 740-1010",
    website: "https://www.steppingstonespediatrictherapy.com",
    description: "Occupational, physical, and speech therapy",
    provider_services: [
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Physical Therapy (PT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 3,
    practice_name: "Achieve Beyond Pediatric Therapy",
    city: "Columbia",
    state: "MD",
    phone: "(301) 970-2260",
    website: "https://www.achievebeyond.com",
    description: "ABA therapy and developmental services",
    provider_services: [
      { intervention_categories: { name: "ABA Therapy (DTT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 4,
    practice_name: "The Behavior Exchange",
    city: "Columbia",
    state: "MD",
    phone: "(410) 872-7330",
    description: "Applied Behavior Analysis (ABA) therapy",
    provider_services: [
      { intervention_categories: { name: "ABA Therapy (DTT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 5,
    practice_name: "Kennedy Krieger Institute",
    city: "Baltimore",
    state: "MD",
    phone: "(443) 923-9200",
    website: "https://www.kennedykrieger.org",
    description: "Comprehensive autism evaluation and treatment",
    provider_services: [
      { intervention_categories: { name: "ABA Therapy (DTT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "ESDM (Early Start Denver Model)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Physical Therapy (PT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 6,
    practice_name: "Center for Autism and Related Disorders (CARD)",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 415-4000",
    website: "https://www.centerforautism.com",
    description: "ABA therapy programs",
    provider_services: [
      { intervention_categories: { name: "ABA Therapy (DTT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 7,
    practice_name: "Annapolis Speech & Hearing",
    city: "Annapolis",
    state: "MD",
    phone: "(410) 224-1500",
    website: "https://www.annapolisspeech.com",
    description: "Speech and hearing services",
    provider_services: [
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 8,
    practice_name: "Little Hands OT",
    city: "Annapolis",
    state: "MD",
    phone: "(410) 571-6161",
    website: "https://www.littlehandsot.com",
    description: "Pediatric occupational therapy",
    provider_services: [
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 9,
    practice_name: "Frederick Pediatric Therapy Center",
    city: "Frederick",
    state: "MD",
    phone: "(301) 620-2020",
    description: "Comprehensive pediatric therapy",
    provider_services: [
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Physical Therapy (PT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 10,
    practice_name: "Talk With Me Speech Therapy",
    city: "Silver Spring",
    state: "MD",
    phone: "(301) 588-0909",
    website: "https://www.talkwithmespeech.com",
    description: "Pediatric speech therapy",
    provider_services: [
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 11,
    practice_name: "ABA Therapies",
    city: "Silver Spring",
    state: "MD",
    phone: "(301) 587-2223",
    website: "https://www.abatherapies.com",
    description: "Applied Behavior Analysis",
    provider_services: [
      { intervention_categories: { name: "ABA Therapy (DTT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 12,
    practice_name: "The Ivymount School",
    city: "Rockville",
    state: "MD",
    phone: "(301) 469-0223",
    website: "https://www.ivymount.org",
    description: "Special education and therapy services",
    provider_services: [
      { intervention_categories: { name: "Speech-Language Therapy (SLT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Occupational Therapy (OT)", evidence_level: "table1", evidence_label: "Evidence-Based" }},
      { intervention_categories: { name: "Physical Therapy (PT)", evidence_level: "table1", evidence_label: "Evidence-Based" }}
    ]
  },
  {
    id: 13,
    practice_name: "Hyperbaric Oxygen Therapy of Maryland",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 555-HBOT",
    website: "https://www.hbotmd.com",
    description: "Hyperbaric oxygen therapy for autism and other conditions",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 14,
    practice_name: "Columbia Hyperbaric Center",
    city: "Columbia",
    state: "MD",
    phone: "(410) 555-0123",
    website: "https://www.columbiahyperbaric.com",
    description: "Hyperbaric oxygen therapy services including autism treatment protocols",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 15,
    practice_name: "Rockville Wellness & Hyperbaric",
    city: "Rockville",
    state: "MD",
    phone: "(301) 555-9876",
    website: "https://www.rockvillehbot.com",
    description: "Integrative medicine with hyperbaric oxygen therapy",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 16,
    practice_name: "Restorative Hyperbaric Therapy of Maryland",
    city: "Towson",
    state: "MD",
    phone: "(410) 825-4999",
    website: "https://maps.app.goo.gl/ottBGLffnxEAPHEA7",
    description: "Hyperbaric oxygen therapy center treating autism, traumatic brain injury, and other conditions",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 17,
    practice_name: "Towson Hyperbaric Center",
    city: "Towson",
    state: "MD",
    phone: "(410) 494-0620",
    description: "Hyperbaric oxygen treatment for developmental conditions including autism",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 18,
    practice_name: "Maryland Hyperbaric & Wellness",
    city: "Frederick",
    state: "MD",
    phone: "(301) 668-4999",
    description: "Integrative hyperbaric oxygen therapy and wellness center",
    provider_services: [
      { intervention_categories: { name: "HBOT (Hyperbaric Oxygen)", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 19,
    practice_name: "Maryland Stem Cell Center",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 878-4545",
    website: "https://www.marylandstemcellcenter.com",
    description: "Regenerative medicine and stem cell therapy for autism and neurological conditions",
    provider_services: [
      { intervention_categories: { name: "Stem Cell Therapy", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 20,
    practice_name: "Chesapeake Biologics",
    city: "Annapolis",
    state: "MD",
    phone: "(410) 224-4100",
    website: "https://www.chesapeakebiologics.com",
    description: "Regenerative medicine clinic offering stem cell and cord blood therapies",
    provider_services: [
      { intervention_categories: { name: "Stem Cell Therapy", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 21,
    practice_name: "Regenerative Orthopedics & Wellness",
    city: "Rockville",
    state: "MD",
    phone: "(301) 658-8989",
    description: "Integrative medicine with mesenchymal stem cell therapy protocols",
    provider_services: [
      { intervention_categories: { name: "Stem Cell Therapy", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  },
  {
    id: 22,
    practice_name: "Johns Hopkins Regenerative Medicine",
    city: "Baltimore",
    state: "MD",
    phone: "(410) 955-5000",
    website: "https://www.hopkinsmedicine.org",
    description: "Academic medical center conducting stem cell research and clinical trials for autism",
    provider_services: [
      { intervention_categories: { name: "Stem Cell Therapy", evidence_level: "table2", evidence_label: "Investigational" }}
    ]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const service = searchParams.get('service');
    const evidenceLevel = searchParams.get('evidence_level');
    const useGoogle = searchParams.get('google') !== 'false'; // Default to true

    let providers: any[] = [];

    // Try Google Places API first if enabled
    if (useGoogle && process.env.GOOGLE_MAPS_API_KEY) {
      console.log('Searching Google Places API...');
      const googleProviders = await searchAutismProviders(city || undefined, service || undefined);
      
      if (googleProviders.length > 0) {
        providers = googleProviders.map(mapGoogleProviderToOurFormat);
        console.log(`Found ${providers.length} providers from Google Places`);
      }
    }

    // If Google didn't return results, try database
    if (providers.length === 0) {
      let query = supabase
        .from('providers')
        .select(`
          *,
          provider_services (
            intervention_id,
            notes,
            intervention_categories (
              name,
              evidence_level,
              evidence_label
            )
          )
        `)
        .eq('verified', true);

      if (city) {
        query = query.ilike('city', `%${city}%`);
      }

      const { data, error } = await query;
      
      // If database has results, use them
      if (data && data.length > 0) {
        providers = data;
      }
    }

    // If still no results, use sample data
    if (providers.length === 0) {
      providers = SAMPLE_PROVIDERS;
    }

    // Filter by city if specified
    if (city) {
      providers = providers.filter(p => 
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }

    // Filter by service if specified
    if (service) {
      providers = providers.filter(provider =>
        provider.provider_services?.some((ps: any) =>
          ps.intervention_categories?.name.toLowerCase().includes(service.toLowerCase())
        )
      );
    }

    // Filter by evidence level if specified
    if (evidenceLevel) {
      providers = providers.filter(provider =>
        provider.provider_services?.some((ps: any) =>
          ps.intervention_categories?.evidence_level === evidenceLevel
        )
      );
    }

    return NextResponse.json({ providers: providers || [] });
  } catch (error) {
    console.error('Provider API error:', error);
    // On error, return sample data filtered by city if provided
    const city = new URL(request.url).searchParams.get('city');
    let providers = SAMPLE_PROVIDERS;
    if (city) {
      providers = providers.filter(p => 
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    return NextResponse.json({ providers });
  }
}
