// Recommendation Engine for Autism Therapies
// Produces personalized recommendations based on child profile

export interface ChildProfile {
  age: number;
  primaryConcerns: string[];
  currentTherapies: string[];
  supportLevel: 'level1' | 'level2' | 'level3' | 'unsure';
  hasGIIssues: boolean;
  hasSensoryIssues: boolean;
  hasSleepIssues: boolean;
  interestedInBiomedical: boolean;
  insuranceType: 'private' | 'medicaid' | 'selfpay' | 'mixed';
  budgetConcern: boolean;
}

export interface Recommendation {
  therapy: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  evidenceLevel: 'strong' | 'moderate' | 'emerging' | 'investigational';
  estimatedCost: string;
  insuranceCoverage: string;
  researchLink?: string;
}

interface TherapyEntry {
  therapy: string;
  category: string;
  evidenceLevel: 'strong' | 'moderate' | 'emerging' | 'investigational';
  estimatedCost: string;
  insuranceCoverage: string;
  researchLink: string;
  conditions: {
    strongMatch: string[];
    weakMatch: string[];
    contraindicated: string[];
    ageRange: [number, number];
    supportLevels: string[];
  };
  reasoning: Record<string, string>;
}

// Therapy database with conditions for recommendation
const THERAPY_DATABASE: TherapyEntry[] = [
  {
    therapy: 'Applied Behavior Analysis (ABA)',
    category: 'Behavioral',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$50-150/hour',
    insuranceCoverage: 'Often covered by insurance (mandated in MD)',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/32232641/',
    conditions: {
      strongMatch: ['behavioral_challenges', 'communication', 'daily_living_skills', 'early_intervention'],
      weakMatch: ['social_skills'],
      contraindicated: [], // Already doing ABA handled separately
      ageRange: [1, 18],
      supportLevels: ['level2', 'level3', 'unsure'],
    },
    reasoning: {
      behavioral_challenges: 'ABA is highly effective for reducing challenging behaviors and teaching replacement skills.',
      communication: 'ABA includes protocols specifically designed to develop communication skills.',
      daily_living_skills: 'ABA excels at breaking down daily living skills into teachable steps.',
      early_intervention: 'Early intensive ABA (before age 5) shows the strongest outcomes.',
      social_skills: 'ABA can address social skills through structured teaching.',
      default: 'ABA is the most researched behavioral intervention for autism.',
    }
  },
  {
    therapy: 'Speech-Language Therapy',
    category: 'Communication',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$100-250/session',
    insuranceCoverage: 'Usually covered by insurance',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/29436841/',
    conditions: {
      strongMatch: ['communication', 'speech_delay', 'nonverbal', 'social_communication'],
      weakMatch: ['feeding_issues', 'social_skills'],
      contraindicated: [],
      ageRange: [0, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      communication: 'Speech therapy directly addresses communication challenges, the core feature of autism.',
      speech_delay: 'Speech therapists specialize in helping children develop verbal communication.',
      nonverbal: 'SLPs can introduce AAC (augmentative and alternative communication) devices.',
      social_communication: 'Pragmatic language therapy addresses social use of language.',
      feeding_issues: 'Many SLPs specialize in feeding therapy for oral motor issues.',
      default: 'Speech therapy supports communication development across all levels.',
    }
  },
  {
    therapy: 'Occupational Therapy (OT)',
    category: 'Sensory/Motor',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$100-200/session',
    insuranceCoverage: 'Usually covered by insurance',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/30925262/',
    conditions: {
      strongMatch: ['sensory_issues', 'motor_skills', 'daily_living_skills', 'handwriting'],
      weakMatch: ['behavioral_challenges', 'feeding_issues'],
      contraindicated: [],
      ageRange: [0, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      sensory_issues: 'OT with sensory integration is the primary treatment for sensory processing difficulties.',
      motor_skills: 'OTs specialize in fine and gross motor skill development.',
      daily_living_skills: 'OT helps with self-care skills like dressing, eating, and hygiene.',
      handwriting: 'OTs are specialists in handwriting and fine motor coordination.',
      feeding_issues: 'OTs often work on feeding issues related to sensory aversions.',
      default: 'OT addresses sensory and motor challenges common in autism.',
    }
  },
  {
    therapy: 'Social Skills Groups',
    category: 'Social',
    evidenceLevel: 'moderate' as const,
    estimatedCost: '$50-150/session',
    insuranceCoverage: 'Sometimes covered; often out-of-pocket',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/26319250/',
    conditions: {
      strongMatch: ['social_skills', 'peer_relationships', 'social_communication'],
      weakMatch: ['anxiety'],
      contraindicated: [],
      ageRange: [4, 99],
      supportLevels: ['level1', 'level2', 'unsure'],
    },
    reasoning: {
      social_skills: 'Structured social skills groups provide practice with peers in a supportive setting.',
      peer_relationships: 'Groups offer opportunities to develop friendships with neurodivergent peers.',
      social_communication: 'Groups practice conversational skills and social cues.',
      anxiety: 'Groups can help reduce social anxiety through gradual exposure.',
      default: 'Social skills groups complement individual therapy with peer practice.',
    }
  },
  {
    therapy: 'Cognitive Behavioral Therapy (CBT)',
    category: 'Mental Health',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$100-250/session',
    insuranceCoverage: 'Usually covered by insurance',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/30390110/',
    conditions: {
      strongMatch: ['anxiety', 'depression', 'emotional_regulation'],
      weakMatch: ['behavioral_challenges'],
      contraindicated: [],
      ageRange: [7, 99],
      supportLevels: ['level1', 'level2', 'unsure'],
    },
    reasoning: {
      anxiety: 'Modified CBT is highly effective for anxiety in autistic individuals.',
      depression: 'CBT addresses negative thought patterns and coping strategies.',
      emotional_regulation: 'CBT teaches concrete strategies for managing emotions.',
      default: 'CBT is effective for co-occurring anxiety and depression in autism.',
    }
  },
  {
    therapy: 'Parent Training (e.g., PCIT, PRT)',
    category: 'Family Support',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$100-200/session',
    insuranceCoverage: 'Often covered as part of ABA or psychology services',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/25737021/',
    conditions: {
      strongMatch: ['early_intervention', 'behavioral_challenges', 'parent_support'],
      weakMatch: ['communication', 'daily_living_skills'],
      contraindicated: [],
      ageRange: [1, 12],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      early_intervention: 'Parent-mediated interventions are crucial for young children.',
      behavioral_challenges: 'Parent training empowers families to manage behaviors at home.',
      parent_support: 'Provides parents with concrete strategies and emotional support.',
      default: 'Parent training multiplies therapy benefits into daily life.',
    }
  },
  {
    therapy: 'Dietary Modifications',
    category: 'Biomedical',
    evidenceLevel: 'emerging' as const,
    estimatedCost: 'Variable (food costs)',
    insuranceCoverage: 'Not covered; may see dietitian with coverage',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/29875135/',
    conditions: {
      strongMatch: ['gi_issues', 'food_sensitivities'],
      weakMatch: ['behavioral_challenges', 'sleep_issues'],
      contraindicated: [],
      ageRange: [0, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      gi_issues: 'Many autistic children have GI issues that improve with dietary changes.',
      food_sensitivities: 'Elimination diets can identify trigger foods affecting behavior.',
      behavioral_challenges: 'Some families report behavioral improvements with dietary changes.',
      sleep_issues: 'Removing certain foods (caffeine, sugar) may improve sleep.',
      default: 'Dietary modifications may help, especially with GI symptoms.',
    }
  },
  {
    therapy: 'Sulforaphane Supplementation',
    category: 'Supplements',
    evidenceLevel: 'emerging' as const,
    estimatedCost: '$30-60/month',
    insuranceCoverage: 'Not covered',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/25313065/',
    conditions: {
      strongMatch: ['interested_biomedical'],
      weakMatch: ['behavioral_challenges', 'communication', 'social_skills'],
      contraindicated: [],
      ageRange: [3, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      interested_biomedical: 'Sulforaphane has RCT evidence showing improvements in behavior and communication.',
      behavioral_challenges: '2014 study showed improvements in aberrant behavior.',
      communication: 'Study participants showed improved verbal communication.',
      social_skills: 'Social interaction scores improved in clinical trial.',
      default: 'Broccoli sprout extract with promising but limited research.',
    }
  },
  {
    therapy: 'Probiotics',
    category: 'Supplements',
    evidenceLevel: 'emerging' as const,
    estimatedCost: '$20-50/month',
    insuranceCoverage: 'Not covered',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/30967657/',
    conditions: {
      strongMatch: ['gi_issues', 'interested_biomedical'],
      weakMatch: ['behavioral_challenges'],
      contraindicated: [],
      ageRange: [0, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      gi_issues: 'Probiotics directly address gut health, often impaired in autism.',
      interested_biomedical: 'Gut-brain axis research supports probiotic use.',
      behavioral_challenges: 'Some studies show behavioral improvements with probiotics.',
      default: 'May help GI symptoms; research on autism-specific benefits ongoing.',
    }
  },
  {
    therapy: 'Melatonin for Sleep',
    category: 'Supplements',
    evidenceLevel: 'moderate' as const,
    estimatedCost: '$10-20/month',
    insuranceCoverage: 'Not covered (OTC)',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/31722829/',
    conditions: {
      strongMatch: ['sleep_issues'],
      weakMatch: [],
      contraindicated: [],
      ageRange: [2, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      sleep_issues: 'Melatonin is well-studied and effective for sleep issues in autism.',
      default: 'Recommended only for sleep difficulties.',
    }
  },
  {
    therapy: 'Omega-3 Fatty Acids',
    category: 'Supplements',
    evidenceLevel: 'emerging' as const,
    estimatedCost: '$15-40/month',
    insuranceCoverage: 'Not covered',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/28166348/',
    conditions: {
      strongMatch: ['interested_biomedical'],
      weakMatch: ['attention_issues', 'behavioral_challenges'],
      contraindicated: [],
      ageRange: [2, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      interested_biomedical: 'Omega-3s have anti-inflammatory properties with some positive studies.',
      attention_issues: 'May help with attention and hyperactivity.',
      default: 'Generally safe with mixed evidence for autism specifically.',
    }
  },
  {
    therapy: 'HBOT (Hyperbaric Oxygen Therapy)',
    category: 'Investigational',
    evidenceLevel: 'investigational' as const,
    estimatedCost: '$100-250/session (40+ sessions typical)',
    insuranceCoverage: 'Not covered for autism',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/19250171/',
    conditions: {
      strongMatch: ['interested_biomedical'],
      weakMatch: [],
      contraindicated: [],
      ageRange: [2, 99],
      supportLevels: ['level2', 'level3'],
    },
    reasoning: {
      interested_biomedical: 'Some studies show improvements, but evidence is limited and mixed.',
      default: 'Investigational therapy with limited evidence. Very expensive.',
    }
  },
  {
    therapy: 'Psychiatric Medication Evaluation',
    category: 'Medical',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$150-400 initial eval',
    insuranceCoverage: 'Usually covered',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/27091414/',
    conditions: {
      strongMatch: ['anxiety', 'depression', 'severe_behavioral_challenges', 'adhd_symptoms'],
      weakMatch: ['sleep_issues', 'emotional_regulation'],
      contraindicated: [],
      ageRange: [4, 99],
      supportLevels: ['level1', 'level2', 'level3', 'unsure'],
    },
    reasoning: {
      anxiety: 'Medication may help when therapy alone is insufficient for anxiety.',
      depression: 'Antidepressants can be helpful for co-occurring depression.',
      severe_behavioral_challenges: 'Risperidone/aripiprazole are FDA-approved for irritability in autism.',
      adhd_symptoms: 'Stimulants or non-stimulants may help attention issues.',
      default: 'Consider if behavioral interventions need additional support.',
    }
  },
  {
    therapy: 'AAC (Augmentative & Alternative Communication)',
    category: 'Communication',
    evidenceLevel: 'strong' as const,
    estimatedCost: '$0-300 for apps; $5,000-15,000 for dedicated devices',
    insuranceCoverage: 'Often covered with SLP recommendation',
    researchLink: 'https://pubmed.ncbi.nlm.nih.gov/27159078/',
    conditions: {
      strongMatch: ['nonverbal', 'limited_speech', 'communication'],
      weakMatch: [],
      contraindicated: [],
      ageRange: [1, 99],
      supportLevels: ['level2', 'level3'],
    },
    reasoning: {
      nonverbal: 'AAC provides a voice for nonverbal individuals - does NOT prevent speech development.',
      limited_speech: 'AAC supplements limited verbal abilities.',
      communication: 'Can reduce frustration and challenging behaviors by enabling communication.',
      default: 'Essential for individuals with limited verbal communication.',
    }
  },
];

// Concern mapping to database conditions
const CONCERN_MAPPING: Record<string, string[]> = {
  'communication': ['communication', 'speech_delay'],
  'speech_delay': ['speech_delay', 'communication', 'nonverbal'],
  'nonverbal': ['nonverbal', 'limited_speech', 'communication'],
  'behavior': ['behavioral_challenges'],
  'aggression': ['behavioral_challenges', 'severe_behavioral_challenges'],
  'self_injury': ['behavioral_challenges', 'severe_behavioral_challenges'],
  'tantrums': ['behavioral_challenges', 'emotional_regulation'],
  'sensory': ['sensory_issues'],
  'motor_skills': ['motor_skills'],
  'social': ['social_skills', 'peer_relationships', 'social_communication'],
  'anxiety': ['anxiety'],
  'depression': ['depression'],
  'sleep': ['sleep_issues'],
  'eating': ['feeding_issues', 'food_sensitivities'],
  'gi_issues': ['gi_issues'],
  'attention': ['attention_issues', 'adhd_symptoms'],
  'daily_living': ['daily_living_skills'],
  'early_intervention': ['early_intervention'],
};

export function generateRecommendations(profile: ChildProfile): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const currentTherapiesLower = profile.currentTherapies.map(t => t.toLowerCase());
  
  // Map concerns to condition tags
  const activeConcerns: string[] = [];
  for (const concern of profile.primaryConcerns) {
    const mapped = CONCERN_MAPPING[concern] || [concern];
    activeConcerns.push(...mapped);
  }
  
  // Add implicit concerns
  if (profile.hasGIIssues) activeConcerns.push('gi_issues');
  if (profile.hasSensoryIssues) activeConcerns.push('sensory_issues');
  if (profile.hasSleepIssues) activeConcerns.push('sleep_issues');
  if (profile.interestedInBiomedical) activeConcerns.push('interested_biomedical');
  if (profile.age < 5) activeConcerns.push('early_intervention');
  
  // Score each therapy
  for (const therapy of THERAPY_DATABASE) {
    // Skip if already doing this therapy
    const therapyLower = therapy.therapy.toLowerCase();
    if (currentTherapiesLower.some(t => 
      therapyLower.includes(t) || t.includes(therapyLower.split(' ')[0])
    )) {
      continue;
    }
    
    // Check age range
    if (profile.age < therapy.conditions.ageRange[0] || 
        profile.age > therapy.conditions.ageRange[1]) {
      continue;
    }
    
    // Check support level (if specified)
    if (therapy.conditions.supportLevels.length > 0 && 
        !therapy.conditions.supportLevels.includes(profile.supportLevel)) {
      // Only skip if it's a strong requirement
      if (therapy.therapy === 'Applied Behavior Analysis (ABA)' && 
          profile.supportLevel === 'level1') {
        continue; // ABA less critical for level 1
      }
    }
    
    // Calculate match score
    let score = 0;
    let matchedConcern = '';
    
    for (const concern of activeConcerns) {
      if (therapy.conditions.strongMatch.includes(concern)) {
        score += 3;
        if (!matchedConcern) matchedConcern = concern;
      } else if (therapy.conditions.weakMatch.includes(concern)) {
        score += 1;
        if (!matchedConcern) matchedConcern = concern;
      }
    }
    
    // Skip if no match at all
    if (score === 0) continue;
    
    // Budget adjustments
    if (profile.budgetConcern && therapy.insuranceCoverage.includes('Not covered')) {
      score -= 1;
    }
    
    // Determine priority
    let priority: 'high' | 'medium' | 'low' = 'low';
    if (score >= 5) priority = 'high';
    else if (score >= 2) priority = 'medium';
    
    // Get reasoning
    const reasoningKey = matchedConcern || 'default';
    const reasoning = therapy.reasoning[reasoningKey as keyof typeof therapy.reasoning] || 
                     therapy.reasoning.default;
    
    recommendations.push({
      therapy: therapy.therapy,
      category: therapy.category,
      priority,
      reasoning,
      evidenceLevel: therapy.evidenceLevel,
      estimatedCost: therapy.estimatedCost,
      insuranceCoverage: therapy.insuranceCoverage,
      researchLink: therapy.researchLink,
    });
  }
  
  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return recommendations;
}
