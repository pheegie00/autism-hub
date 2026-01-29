import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export interface GoogleProvider {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
  types: string[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// Maryland cities to search
const MD_CITIES = [
  'Columbia, MD',
  'Baltimore, MD',
  'Annapolis, MD',
  'Silver Spring, MD',
  'Rockville, MD',
  'Frederick, MD',
  'Gaithersburg, MD',
  'Bowie, MD',
  'Hagerstown, MD',
  'Towson, MD'
];

// Service types to search for (based on intervention guide)
const SERVICE_KEYWORDS = [
  // Table 1: Evidence-Based
  'autism therapy',
  'ABA therapy Maryland',
  'discrete trial training',
  'ESDM therapy',
  'speech therapy autism',
  'occupational therapy autism',
  'physical therapy autism',
  'feeding therapy autism',
  'AAC augmentative communication',
  'DIR Floortime',
  'autism behavioral health',
  'developmental pediatrics',
  'autism evaluation',
  
  // Table 2: Investigational
  'hyperbaric oxygen therapy Maryland',
  'HBOT autism',
  'integrative medicine autism',
  
  // General autism services
  'autism center Maryland',
  'autism clinic',
  'developmental delays therapy'
];

export async function searchAutismProviders(
  city?: string,
  serviceType?: string
): Promise<GoogleProvider[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('GOOGLE_MAPS_API_KEY not configured');
    return [];
  }

  const allProviders: GoogleProvider[] = [];
  const seenPlaceIds = new Set<string>();

  // Determine search locations
  const searchLocations = city 
    ? [`${city}, MD`]
    : MD_CITIES;

  // Determine search keywords
  const searchKeywords = serviceType
    ? [serviceType]
    : SERVICE_KEYWORDS;

  try {
    for (const location of searchLocations) {
      for (const keyword of searchKeywords) {
        try {
          const response = await client.textSearch({
            params: {
              query: `${keyword} ${location}`,
              key: apiKey,
            },
          });

          if (response.data.results) {
            for (const place of response.data.results) {
              // Avoid duplicates
              if (!seenPlaceIds.has(place.place_id!)) {
                seenPlaceIds.add(place.place_id!);
                
                // Get detailed info
                try {
                  const detailsResponse = await client.placeDetails({
                    params: {
                      place_id: place.place_id!,
                      key: apiKey,
                      fields: [
                        'place_id',
                        'name',
                        'formatted_address',
                        'formatted_phone_number',
                        'website',
                        'rating',
                        'user_ratings_total',
                        'types',
                        'geometry'
                      ]
                    }
                  });

                  if (detailsResponse.data.result) {
                    allProviders.push(detailsResponse.data.result as GoogleProvider);
                  }
                } catch (detailError) {
                  console.error('Error fetching place details:', detailError);
                }
              }
            }
          }

          // Rate limiting - wait 200ms between requests
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (searchError) {
          console.error(`Error searching ${keyword} in ${location}:`, searchError);
        }
      }
    }

    console.log(`Found ${allProviders.length} unique providers via Google Places`);
    return allProviders;
  } catch (error) {
    console.error('Google Places API error:', error);
    return [];
  }
}

export function mapGoogleProviderToOurFormat(googleProvider: GoogleProvider) {
  // Extract city from address
  const addressParts = googleProvider.formatted_address.split(',');
  const city = addressParts[addressParts.length - 2]?.trim() || 'Unknown';

  // Determine service types from Google types and name
  const services: string[] = [];
  const nameLower = googleProvider.name.toLowerCase();
  
  if (nameLower.includes('aba') || nameLower.includes('behavior')) {
    services.push('ABA Therapy (DTT)');
  }
  if (nameLower.includes('speech')) {
    services.push('Speech-Language Therapy (SLT)');
  }
  if (nameLower.includes('occupational') || nameLower.includes(' ot ')) {
    services.push('Occupational Therapy (OT)');
  }
  if (nameLower.includes('physical') || nameLower.includes(' pt ')) {
    services.push('Physical Therapy (PT)');
  }

  return {
    id: googleProvider.place_id,
    practice_name: googleProvider.name,
    city,
    state: 'MD',
    phone: googleProvider.formatted_phone_number,
    website: googleProvider.website,
    description: `Rating: ${googleProvider.rating || 'N/A'} (${googleProvider.user_ratings_total || 0} reviews)`,
    latitude: googleProvider.geometry.location.lat,
    longitude: googleProvider.geometry.location.lng,
    provider_services: services.map(s => ({
      intervention_categories: {
        name: s,
        evidence_level: 'table1',
        evidence_label: 'Evidence-Based'
      }
    })),
    google_place_id: googleProvider.place_id,
    google_rating: googleProvider.rating,
    google_reviews: googleProvider.user_ratings_total
  };
}
