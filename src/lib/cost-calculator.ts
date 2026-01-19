/**
 * AI Cost Calculator for AppForge
 * 
 * Pricing từ các provider (as of Jan 2026):
 * - OpenAI: https://platform.openai.com/docs/pricing
 * - Anthropic: https://anthropic.com/pricing
 * - Google: https://ai.google.dev/pricing
 * 
 * STRATEGY: Dùng các model MẠNH NHẤT để output chất lượng cao nhất
 */

export interface ModelPricing {
  inputPerMillion: number;  // USD per 1M input tokens
  outputPerMillion: number; // USD per 1M output tokens
  name: string;
  provider: string;
  tier: "flagship" | "standard" | "budget"; // Model tier
  description: string;
}

// Pricing per 1M tokens (USD) - January 2026 prices
// CHỈ GIỮ LẠI CÁC MODEL MẠNH NHẤT
export const MODEL_PRICING: Record<string, ModelPricing> = {
  // OpenAI - GPT-5.2 (latest flagship - Jan 2026)
  "gpt-5.2": {
    inputPerMillion: 1.75,
    outputPerMillion: 14.00,
    name: "GPT-5.2",
    provider: "OpenAI",
    tier: "flagship",
    description: "Best for coding and agentic tasks",
  },
  
  // Anthropic - Claude 4.5 series (Jan 2026)
  "claude-sonnet-4.5": {
    inputPerMillion: 3.00,
    outputPerMillion: 15.00,
    name: "Claude Sonnet 4.5",
    provider: "Anthropic",
    tier: "flagship",
    description: "Optimal balance of intelligence, cost, and speed",
  },
  "claude-opus-4.5": {
    inputPerMillion: 5.00,
    outputPerMillion: 25.00,
    name: "Claude Opus 4.5",
    provider: "Anthropic",
    tier: "flagship",
    description: "Most intelligent model for building agents and coding",
  },
  
  // Google - Gemini 3 Pro (Jan 2026)
  "gemini-3-pro": {
    inputPerMillion: 1.50,
    outputPerMillion: 12.00,
    name: "Gemini 3 Pro",
    provider: "Google",
    tier: "flagship",
    description: "Google's most capable model",
  },
};

// Models được offer trong app (chỉ flagship - Jan 2026)
export const AVAILABLE_MODELS = [
  "gpt-5.2",           // OpenAI flagship - best for coding
  "claude-sonnet-4.5", // Anthropic balanced
  "claude-opus-4.5",   // Anthropic most intelligent
  "gemini-3-pro",      // Google flagship
] as const;

export type AvailableModel = typeof AVAILABLE_MODELS[number];

/**
 * Ước tính số tokens cho một generation
 * 
 * Dựa trên phân tích thực tế:
 * - System prompt: ~2500 tokens (với enhanced prompt + category context)
 * - User prompt: ~200-400 tokens
 * - Output (MVP code): ~4000-6000 tokens (average ~5000 for quality MVP)
 */
export interface TokenEstimate {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export function estimateTokensForGeneration(
  type: "new" | "modify" = "new",
  hasCategory: boolean = true
): TokenEstimate {
  // System prompt tokens (enhanced prompts are longer)
  const baseSystemPrompt = 2000; // Enhanced prompt
  const categoryContext = hasCategory ? 1000 : 0; // Category-specific context

  // User prompt tokens
  const userPromptTokens = type === "new" ? 300 : 500;

  // For modifications, we also send current code
  const currentCodeTokens = type === "modify" ? 3000 : 0;

  // Output tokens (MVP code - quality code is longer)
  const outputTokens = type === "new" ? 5000 : 3500;

  const inputTokens = baseSystemPrompt + categoryContext + userPromptTokens + currentCodeTokens;

  return {
    inputTokens,
    outputTokens,
    totalTokens: inputTokens + outputTokens,
  };
}

/**
 * Tính chi phí cho một generation
 */
export interface CostEstimate {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  model: string;
  provider: string;
}

export function calculateGenerationCost(
  modelId: string,
  type: "new" | "modify" = "new",
  hasCategory: boolean = true
): CostEstimate {
  const pricing = MODEL_PRICING[modelId];
  if (!pricing) {
    throw new Error(`Unknown model: ${modelId}`);
  }

  const tokens = estimateTokensForGeneration(type, hasCategory);

  const inputCost = (tokens.inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (tokens.outputTokens / 1_000_000) * pricing.outputPerMillion;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    model: pricing.name,
    provider: pricing.provider,
  };
}

/**
 * Tính chi phí trung bình cho một user session
 * (1 new generation + 4 modifications - realistic usage)
 */
export function calculateSessionCost(modelId: string): number {
  const newCost = calculateGenerationCost(modelId, "new", true);
  const modifyCost = calculateGenerationCost(modelId, "modify", true);

  // Average session: 1 new + 4 modifications
  return newCost.totalCost + modifyCost.totalCost * 4;
}

/**
 * Summary của available models (flagship only)
 */
export function getAvailableModelsCostSummary() {
  return AVAILABLE_MODELS.map((modelId) => {
    const newCost = calculateGenerationCost(modelId, "new", true);
    const sessionCost = calculateSessionCost(modelId);
    const pricing = MODEL_PRICING[modelId];

    return {
      modelId,
      name: pricing.name,
      provider: pricing.provider,
      description: pricing.description,
      costPerGeneration: newCost.totalCost,
      costPerSession: sessionCost,
      costPer100Generations: newCost.totalCost * 100,
    };
  });
}

/**
 * Business analysis cho pricing
 */
export function getBusinessAnalysis(proPlanPrice: number = 20) {
  const summary = getAvailableModelsCostSummary();

  // Calculate weighted average (assuming equal distribution)
  const avgCostPerGen = summary.reduce((sum, m) => sum + m.costPerGeneration, 0) / summary.length;

  // Most expensive model
  const mostExpensive = summary.reduce((a, b) =>
    a.costPerGeneration > b.costPerGeneration ? a : b
  );

  // Cheapest flagship model
  const cheapestFlagship = summary.reduce((a, b) =>
    a.costPerGeneration < b.costPerGeneration ? a : b
  );

  return {
    models: summary,
    averageCostPerGeneration: avgCostPerGen,
    mostExpensiveModel: mostExpensive,
    cheapestFlagshipModel: cheapestFlagship,
    
    // Pro plan analysis
    proPlan: {
      price: proPlanPrice,
      // Break-even calculations
      breakEvenGenerations: {
        average: Math.floor(proPlanPrice / avgCostPerGen),
        worstCase: Math.floor(proPlanPrice / mostExpensive.costPerGeneration),
        bestCase: Math.floor(proPlanPrice / cheapestFlagship.costPerGeneration),
      },
      // Assuming user does 50 generations/month (realistic)
      estimatedCostAt50Gens: avgCostPerGen * 50,
      estimatedCostAt100Gens: avgCostPerGen * 100,
      // Profit margins
      profitMarginAt50Gens: ((proPlanPrice - avgCostPerGen * 50) / proPlanPrice * 100).toFixed(1),
      profitMarginAt100Gens: ((proPlanPrice - avgCostPerGen * 100) / proPlanPrice * 100).toFixed(1),
    },

    // Free tier analysis (5 gens/day using cheapest flagship)
    freeTier: {
      generationsPerDay: 5,
      generationsPerMonth: 150,
      costPerMonth: cheapestFlagship.costPerGeneration * 150,
    },

    // Recommendations
    recommendations: {
      suggestedProPrice: Math.ceil(avgCostPerGen * 100 * 2), // 2x markup at 100 gens
      suggestedEnterprisePrice: Math.ceil(avgCostPerGen * 500 * 1.5), // 1.5x markup at 500 gens
    },
  };
}

// Export formatted cost display
export function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(1)}m`; // millicents
  }
  if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

// Print comprehensive cost analysis
export function printCostAnalysis() {
  console.log("\n╔════════════════════════════════════════════════════════════════╗");
  console.log("║     AppForge AI - Flagship Models Cost Analysis                ║");
  console.log("╚════════════════════════════════════════════════════════════════╝\n");

  const analysis = getBusinessAnalysis(20);

  console.log("┌─────────────────────┬────────────┬─────────────┬──────────────┐");
  console.log("│ Model               │ Per Gen    │ Per Session │ Per 100 Gens │");
  console.log("├─────────────────────┼────────────┼─────────────┼──────────────┤");

  analysis.models.forEach(m => {
    const name = m.name.padEnd(19);
    const gen = formatCost(m.costPerGeneration).padStart(10);
    const session = formatCost(m.costPerSession).padStart(11);
    const hundred = formatCost(m.costPer100Generations).padStart(12);
    console.log(`│ ${name}│${gen} │${session} │${hundred} │`);
  });

  console.log("└─────────────────────┴────────────┴─────────────┴──────────────┘");

  console.log("\n📊 Business Analysis for $20/month Pro Plan:");
  console.log("─".repeat(55));
  console.log(`Average cost per generation: ${formatCost(analysis.averageCostPerGeneration)}`);
  console.log(`Most expensive: ${analysis.mostExpensiveModel.name} @ ${formatCost(analysis.mostExpensiveModel.costPerGeneration)}/gen`);
  console.log(`Cheapest flagship: ${analysis.cheapestFlagshipModel.name} @ ${formatCost(analysis.cheapestFlagshipModel.costPerGeneration)}/gen`);

  console.log("\n📈 Break-even Analysis:");
  console.log(`  Best case (${analysis.cheapestFlagshipModel.name}): ${analysis.proPlan.breakEvenGenerations.bestCase} gens`);
  console.log(`  Average: ${analysis.proPlan.breakEvenGenerations.average} gens`);
  console.log(`  Worst case (${analysis.mostExpensiveModel.name}): ${analysis.proPlan.breakEvenGenerations.worstCase} gens`);

  console.log("\n💰 Profit Margins at $20/month:");
  console.log(`  At 50 gens/month: Cost ${formatCost(analysis.proPlan.estimatedCostAt50Gens)} → ${analysis.proPlan.profitMarginAt50Gens}% margin`);
  console.log(`  At 100 gens/month: Cost ${formatCost(analysis.proPlan.estimatedCostAt100Gens)} → ${analysis.proPlan.profitMarginAt100Gens}% margin`);

  console.log("\n🆓 Free Tier Cost (5 gens/day with cheapest flagship):");
  console.log(`  Monthly cost: ${formatCost(analysis.freeTier.costPerMonth)} for ${analysis.freeTier.generationsPerMonth} gens`);

  console.log("\n✅ Pricing Recommendations:");
  console.log(`  Pro plan: $${analysis.recommendations.suggestedProPrice}/month (2x markup at 100 gens)`);
  console.log(`  Enterprise: $${analysis.recommendations.suggestedEnterprisePrice}/month (1.5x markup at 500 gens)`);
  console.log("");
}
