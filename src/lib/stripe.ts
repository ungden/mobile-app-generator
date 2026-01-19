import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Client-side Stripe instance
let stripePromise: Promise<any> | null = null;

export const getStripe = () => {
  if (!stripePromise && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

/**
 * Cost Analysis (Per Generation) - FLAGSHIP MODELS ONLY (January 2026):
 * 
 * | Model               | Cost/Gen   | Break-even at $29/mo |
 * |---------------------|------------|----------------------|
 * | GPT-5.2             | $0.074     | ~392 gens            |
 * | Claude Sonnet 4.5   | $0.085     | ~341 gens            |
 * | Claude Opus 4.5     | $0.142     | ~204 gens            |
 * | Gemini 3 Pro        | $0.065     | ~446 gens            |
 * 
 * Average cost per generation: ~$0.091
 * 
 * Estimated Monthly Cost (all flagship models):
 * - Free tier (5/day × 30 = 150 gens): ~$13.65
 * - Pro tier (100 gens/mo): ~$9.10
 * - Profit margin at $29/mo with 100 gens: ~69%
 */

// Available AI models
export const FLAGSHIP_MODELS = ["gpt-4o", "claude-sonnet-4", "gemini-2.0-flash"];

// Pricing configuration
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 generations per day",
      "All flagship AI models",
      "Live preview",
      "Code export (App.js)",
    ],
    limits: {
      generationsPerDay: 5,
    },
    // Business metrics
    estimatedCostPerUser: 13.65, // per month (150 gens × $0.091 avg)
  },
  pro: {
    name: "Pro",
    price: 29, // Account for flagship model costs
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
    features: [
      "Unlimited generations",
      "All flagship AI models (GPT-5.2, Claude Sonnet 4.5, Opus 4.5, Gemini 3 Pro)",
      "Full Expo project export",
      "QR code testing",
      "Priority support",
      "Project history",
    ],
    limits: {
      generationsPerDay: -1, // unlimited
    },
    // Business metrics
    estimatedCostPerUser: 9.10, // per month (100 gens avg)
    profitMargin: 0.69, // 69%
  },
  enterprise: {
    name: "Enterprise",
    price: null, // Contact sales
    priceId: null,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Custom AI training",
      "Dedicated support",
      "SLA guarantee",
      "White-label options",
    ],
    limits: {
      generationsPerDay: -1,
    },
  },
};

export type PlanType = keyof typeof PLANS;

// All models are allowed for all tiers - no restrictions on flagship models
export function isModelAllowedForTier(model: string, tier: PlanType): boolean {
  return FLAGSHIP_MODELS.includes(model);
}

// Get default model for any tier
export function getDefaultModelForTier(tier: PlanType): string {
  return "claude-sonnet-4"; // Best for coding
}
