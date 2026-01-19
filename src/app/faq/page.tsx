"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "What is 24fit?",
    a: "24fit is an AI-powered platform that generates complete mobile apps from text descriptions. Just describe what you want, and our AI creates a working React Native app with UI, backend integration, and database support.",
  },
  {
    q: "What technology does 24fit use?",
    a: "We use React Native with Expo for cross-platform mobile development, Supabase for backend and database, and multiple AI models including Claude Sonnet, GPT-4o, and Gemini Flash for code generation.",
  },
  {
    q: "Is the generated code production-ready?",
    a: "The generated code is a solid MVP that you can customize and deploy. It follows React Native best practices and includes proper styling, state management, and Supabase integration.",
  },
  {
    q: "Can I export my app?",
    a: "Yes! Free users can export the App.js file. Pro users can download a complete Expo project ready to build and publish to app stores.",
  },
  {
    q: "What AI models are available?",
    a: "All users have access to Claude Sonnet (Anthropic), GPT-4o (OpenAI), and Gemini Flash (Google). Each model has its strengths for different types of apps.",
  },
  {
    q: "How many apps can I generate?",
    a: "Free users get 5 generations per day. Pro users get unlimited generations. Each prompt or modification counts as one generation.",
  },
  {
    q: "Do I need coding experience?",
    a: "No! 24fit is designed for everyone. Just describe your app in plain English and our AI handles the coding. However, some coding knowledge can help you customize the generated code.",
  },
  {
    q: "Can I modify the generated code?",
    a: "Absolutely. You can ask the AI to make changes through the chat, or export the code and edit it yourself in your preferred code editor.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link href="/">
          <Logo size="md" />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-400 mb-12">Everything you need to know about 24fit</p>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#222] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4 text-gray-400 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-16 p-6 bg-[#111] border border-[#222] rounded-xl text-center">
          <h2 className="font-semibold mb-2">Still have questions?</h2>
          <p className="text-gray-400 text-sm mb-4">
            We're here to help. Reach out anytime.
          </p>
          <a
            href="mailto:support@24fit.app"
            className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium transition-colors"
          >
            Contact Support
          </a>
        </div>
      </main>
    </div>
  );
}
