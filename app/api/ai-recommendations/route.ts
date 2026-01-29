import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { symptoms, childAge } = await request.json();

    // Build symptom description
    const symptomList = [];
    if (symptoms.stemming) symptomList.push('repetitive movements/stimming');
    if (symptoms.walkingInCircles) symptomList.push('walking in circles');
    if (symptoms.limitedSpeech) symptomList.push('limited or no speech');
    if (symptoms.sensoryIssues) symptomList.push('sensory sensitivities');
    if (symptoms.feedingDifficulties) symptomList.push('feeding difficulties');
    if (symptoms.sleepProblems) symptomList.push('sleep problems');
    if (symptoms.aggression) symptomList.push('aggression or self-injury');
    if (symptoms.anxious) symptomList.push('anxiety');
    if (symptoms.socialChallenges) symptomList.push('social difficulties');
    if (symptoms.motorDelays) symptomList.push('motor delays');
    if (symptoms.customSymptoms) symptomList.push(symptoms.customSymptoms);

    const prompt = `You are an autism intervention specialist with deep knowledge of evidence-based treatments. A parent is seeking guidance for their ${childAge} child with autism who exhibits the following symptoms:

${symptomList.map(s => `- ${s}`).join('\n')}

Based on these symptoms and current research, provide a comprehensive therapy protocol that "stacks" multiple evidence-based interventions. Your recommendations should:

1. **Prioritize evidence-based therapies** (Table 1: Mainstream - ABA/DTT, ESDM, SLP, OT, PT, feeding therapy)
2. **Include appropriate investigational therapies** (Table 2: emerging evidence - discuss folinic acid, dietary interventions like ketogenic diet, targeted supplements IF biologically plausible)
3. **Address multiple domains**: behavioral, communication, sensory, medical/nutritional
4. **Stack therapies** that work synergistically (e.g., ABA + speech therapy + OT + dietary modifications)
5. **Be age-appropriate** and realistic

Organize your response into 3 categories:
- **Primary Therapies** (evidence-based, insurance-covered)
- **Supportive Interventions** (dietary, supplements, lifestyle - investigational but biologically plausible)
- **Medical Considerations** (things to discuss with physician - sleep support, GI issues, etc.)

For each recommendation, briefly explain WHY it addresses the specific symptoms mentioned.

Format your response as JSON:
{
  "recommendations": [
    {
      "category": "Primary Therapies",
      "therapies": ["therapy 1", "therapy 2"],
      "rationale": "explanation of how these address the symptoms",
      "evidenceLevel": "Evidence-Based"
    },
    {
      "category": "Supportive Interventions",
      "therapies": ["intervention 1", "intervention 2"],
      "rationale": "explanation",
      "evidenceLevel": "Investigational"
    },
    {
      "category": "Medical Considerations",
      "therapies": ["consideration 1", "consideration 2"],
      "rationale": "explanation",
      "evidenceLevel": "Consult Physician"
    }
  ]
}

Be specific, practical, and always emphasize working with qualified healthcare providers.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const recommendations = JSON.parse(jsonMatch[0]);
      return NextResponse.json(recommendations);
    }

    // Fallback if parsing fails
    return NextResponse.json({
      recommendations: [
        {
          category: "Primary Therapies",
          therapies: [
            "Applied Behavior Analysis (ABA/DTT) - 20+ hours/week",
            "Speech-Language Therapy (SLP) - 2-3x/week",
            "Occupational Therapy (OT) with sensory integration - 2x/week"
          ],
          rationale: "These evidence-based therapies address repetitive behaviors, communication delays, and sensory challenges. ABA provides structure and teaches functional skills, SLP develops communication, and OT addresses sensory regulation.",
          evidenceLevel: "Evidence-Based"
        },
        {
          category: "Supportive Interventions",
          therapies: [
            "Structured visual schedules and routines",
            "Dietary evaluation (consider food sensitivities, GI issues)",
            "Adequate sleep hygiene and routine"
          ],
          rationale: "Visual supports reduce anxiety around transitions. Addressing GI/dietary issues may improve behavior and sleep. Many children with autism benefit from consistent routines.",
          evidenceLevel: "Investigational"
        },
        {
          category: "Medical Considerations",
          therapies: [
            "Comprehensive evaluation by developmental pediatrician",
            "Rule out GI issues, sleep disorders",
            "Discuss medication options if aggressive behaviors persist"
          ],
          rationale: "Medical assessment ensures underlying issues are addressed. Sleep problems and GI discomfort can worsen behaviors. Medication may be warranted for severe aggression/self-injury.",
          evidenceLevel: "Consult Physician"
        }
      ]
    });

  } catch (error) {
    console.error('AI Recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
