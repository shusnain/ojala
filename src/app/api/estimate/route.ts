import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI();
}

interface EstimateRequest {
  name: string;
  address: string;
  types: string[];
  website?: string;
}

interface PracticeEstimate {
  practiceType: string;
  monthlySupplySpend: number;
  vendorCount: number;
  providerCount: number;
  reasoning: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EstimateRequest;

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an analyst estimating supply chain characteristics for medical and dental practices. Given a practice's name, address, Google Maps business types, and optional website URL, estimate their profile.

Use these industry benchmarks for monthly supply spend per provider:
- Dermatology: $8,000-$15,000 (biologics, surgical trays, pathology)
- Dental: $6,000-$12,000 (implant components, imaging, sterilization)
- Orthopedics: $15,000-$30,000 (implants, surgical kits, DME)
- Ophthalmology: $10,000-$20,000 (injectables, surgical packs, diagnostics)
- Primary Care: $3,000-$6,000 (vaccines, lab supplies, office consumables)
- Veterinary: $5,000-$10,000 (pharmaceuticals, surgical supplies, reagents)

For vendor count estimates:
- Solo/small practice (1-2 providers): 3-8 vendors
- Mid practice (3-6 providers): 8-15 vendors
- Large practice (7+ providers): 15-30 vendors

Respond with a JSON object containing:
- practiceType: one of "Dermatology", "Dental", "Orthopedics", "Ophthalmology", "Primary Care", "Veterinary", or "Other"
- monthlySupplySpend: estimated total monthly supply spend in dollars (number)
- vendorCount: estimated number of supply vendors (number)
- providerCount: estimated number of providers (number)
- reasoning: 1-2 sentence explanation of how you arrived at the estimate`,
        },
        {
          role: "user",
          content: `Practice: ${body.name}
Address: ${body.address}
Google Maps types: ${body.types.join(", ")}
Website: ${body.website || "not available"}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "No response from model" },
        { status: 500 }
      );
    }

    const estimate: PracticeEstimate = JSON.parse(content);

    // Calculate savings range
    // Base error rate by practice type
    const errorRates: Record<string, number> = {
      Dermatology: 0.02,
      Dental: 0.018,
      Orthopedics: 0.025,
      Ophthalmology: 0.022,
      "Primary Care": 0.015,
      Veterinary: 0.017,
      Other: 0.018,
    };

    const baseRate = errorRates[estimate.practiceType] || 0.018;

    // Vendor count modifier
    let vendorModifier = 0;
    if (estimate.vendorCount > 10) vendorModifier = 0.005;
    else if (estimate.vendorCount > 5) vendorModifier = 0.003;

    const errorRate = baseRate + vendorModifier;
    const annualSpend = estimate.monthlySupplySpend * 12;
    const estimatedLeakage = annualSpend * errorRate;

    // Recovery rate range (60-80% of identified errors)
    const lowRecovery = Math.round(estimatedLeakage * 0.6);
    const highRecovery = Math.round(estimatedLeakage * 0.8);

    return NextResponse.json({
      practice: estimate,
      savings: {
        annualSpend,
        errorRate: Math.round(errorRate * 1000) / 10,
        estimatedLeakage: Math.round(estimatedLeakage),
        recoveryRange: {
          low: lowRecovery,
          high: highRecovery,
        },
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate estimate" },
      { status: 500 }
    );
  }
}
