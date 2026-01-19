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

// Pricing configuration
export const PLANS = {
  free: {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "5 generations per day",
      "Basic preview",
      "Code export (App.js)",
    ],
    limits: {
      generationsPerDay: 5,
    },
  },
  pro: {
    name: "Pro",
    price: 20,
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
    features: [
      "Unlimited generations",
      "All AI models (GPT-4.1, Claude, Gemini)",
      "Full Expo project export",
      "QR code testing",
      "Priority support",
      "Project history",
    ],
    limits: {
      generationsPerDay: -1, // unlimited
    },
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
