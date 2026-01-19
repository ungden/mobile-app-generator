"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { PLANS } from "@/lib/stripe";
import { getStripe } from "@/lib/stripe";

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string | null) => {
    if (!priceId) return;

    setIsLoading(priceId);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (data.error) {
        if (data.error === "Unauthorized") {
          window.location.href = "/login?redirect=/pricing";
          return;
        }
        alert(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to start checkout:", error);
      alert("Failed to start checkout. Please try again.");
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Logo size="md" />
            </Link>

            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-xl text-gray-400">
              Start for free, upgrade when you need more
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-2">{PLANS.free.name}</h3>
              <p className="text-gray-400 text-sm mb-4">Perfect for trying out</p>
              <div className="text-4xl font-bold mb-6">
                ${PLANS.free.price}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PLANS.free.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/build"
                className="block w-full text-center bg-white/10 hover:bg-white/20 py-3 rounded-xl font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-gradient-to-b from-purple-500/20 to-transparent border border-purple-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-xs font-medium px-3 py-1 rounded-full">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold mb-2">{PLANS.pro.name}</h3>
              <p className="text-gray-400 text-sm mb-4">For serious builders</p>
              <div className="text-4xl font-bold mb-6">
                ${PLANS.pro.price}
                <span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PLANS.pro.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(PLANS.pro.priceId)}
                disabled={isLoading === PLANS.pro.priceId}
                className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading === PLANS.pro.priceId ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Upgrade to Pro"
                )}
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-2">
                {PLANS.enterprise.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">For teams and agencies</p>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                {PLANS.enterprise.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:sales@appforge.ai"
                className="block w-full text-center bg-white/10 hover:bg-white/20 py-3 rounded-xl font-medium transition-colors"
              >
                Contact Sales
              </a>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "What counts as a generation?",
                  a: "Each time you send a prompt to generate or modify code counts as one generation.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
                },
                {
                  q: "What AI models are available?",
                  a: "All users get access to our flagship models: GPT-5.2, Claude Sonnet 4.5, Claude Opus 4.5, and Gemini 3 Pro - the most powerful AI models available.",
                },
                {
                  q: "Can I export my apps?",
                  a: "Yes! All users can export code. Pro users can download complete Expo projects ready to build and publish.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-[#111] border border-[#222] rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
