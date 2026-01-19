"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Smartphone,
  Code2,
  Rocket,
  Check,
  Star,
  ChevronRight,
  ShoppingBag,
  Users,
  Heart,
  CheckSquare,
  DollarSign,
  Utensils,
  BookOpen,
  Map,
  Play,
} from "lucide-react";

// App categories for quick start
const appCategories = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: ShoppingBag,
    color: "#10b981",
    example: "App bán quần áo với giỏ hàng",
  },
  {
    id: "social",
    name: "Social Media",
    icon: Users,
    color: "#3b82f6",
    example: "Mạng xã hội chia sẻ ảnh",
  },
  {
    id: "fitness",
    name: "Health & Fitness",
    icon: Heart,
    color: "#ef4444",
    example: "App theo dõi workout với timer",
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: CheckSquare,
    color: "#8b5cf6",
    example: "Todo list với categories",
  },
  {
    id: "finance",
    name: "Finance",
    icon: DollarSign,
    color: "#f59e0b",
    example: "App quản lý chi tiêu cá nhân",
  },
  {
    id: "food",
    name: "Food & Delivery",
    icon: Utensils,
    color: "#f97316",
    example: "App đặt đồ ăn với menu",
  },
  {
    id: "education",
    name: "Education",
    icon: BookOpen,
    color: "#06b6d4",
    example: "Flashcard app học từ vựng",
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: Play,
    color: "#ec4899",
    example: "Music player với playlist",
  },
];

const features = [
  {
    icon: Zap,
    title: "AI-Powered Generation",
    description:
      "Describe your app in plain English and watch it come to life in seconds.",
  },
  {
    icon: Smartphone,
    title: "Live Preview",
    description:
      "See your app running in real-time with our interactive phone simulator.",
  },
  {
    icon: Code2,
    title: "Clean React Native Code",
    description:
      "Get production-ready Expo code that you can customize and deploy.",
  },
  {
    icon: Rocket,
    title: "One-Click Export",
    description:
      "Download your project or deploy directly to the App Store and Play Store.",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your App",
    description: "Tell us what you want to build in plain English",
  },
  {
    number: "02",
    title: "AI Generates Code",
    description: "Our AI creates a complete React Native application",
  },
  {
    number: "03",
    title: "Preview & Refine",
    description: "See it live, make changes, iterate until perfect",
  },
  {
    number: "04",
    title: "Export & Deploy",
    description: "Download your code or publish to app stores",
  },
];

const examples = [
  "A fitness tracking app with workout logging",
  "A recipe app with categories and favorites",
  "A habit tracker with streaks and reminders",
];

export default function LandingPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AppForge</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">
                How it works
              </a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/build"
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-8">
            <Star className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Now with GPT-5.2 & Claude Opus 4.5</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Build mobile apps
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
              with AI, fast.
            </span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Describe your app idea and watch it come to life. AppForge generates
            complete, cross-platform mobile apps using AI and Expo (React Native).
          </p>

          {/* Main Input */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe the mobile app you want to build..."
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-2xl px-6 py-4 pr-32 text-lg focus:outline-none focus:border-purple-500 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && inputValue.trim()) {
                    window.location.href = `/build?prompt=${encodeURIComponent(inputValue)}`;
                  }
                }}
              />
              <Link
                href={inputValue.trim() ? `/build?prompt=${encodeURIComponent(inputValue)}` : "/build"}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-500 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                Build
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Example prompts */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="text-sm text-gray-500">Try:</span>
              {examples.map((example, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(example)}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  &ldquo;{example}&rdquo;{i < examples.length - 1 ? "," : ""}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* App Categories - Quick Start */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              What do you want to build?
            </h2>
            <p className="text-gray-400">
              Choose a category to get started with smart AI suggestions
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {appCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/build?category=${category.id}`}
                  className="group bg-[#111] border border-[#222] rounded-2xl p-5 hover:border-purple-500/50 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/10"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {category.example}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to build apps
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              From idea to App Store in minutes, not months.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-purple-500/50 transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-4 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-gray-400">Four simple steps to your mobile app</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-purple-500/20 mb-4">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-purple-500/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-gray-400">Start for free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-gray-400 text-sm mb-4">Perfect for trying out</p>
              <div className="text-4xl font-bold mb-6">
                $0<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {["5 generations per day", "All flagship AI models", "Live preview", "Code export"].map(
                  (item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-400" />
                      {item}
                    </li>
                  )
                )}
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
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-4">For serious builders</p>
              <div className="text-4xl font-bold mb-6">
                $29<span className="text-lg text-gray-400">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  "Unlimited generations",
                  "GPT-5.2, Claude Sonnet/Opus 4.5, Gemini 3 Pro",
                  "Full Expo project export",
                  "QR code testing",
                  "Priority support",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-medium transition-colors block text-center">
                Upgrade to Pro
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-400 text-sm mb-4">For teams and agencies</p>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                {[
                  "Everything in Pro",
                  "Team collaboration",
                  "Custom AI training",
                  "Dedicated support",
                  "SLA guarantee",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-white/10 hover:bg-white/20 py-3 rounded-xl font-medium transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-t from-purple-500/10 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to build your app?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of creators building mobile apps with AI.
          </p>
          <Link
            href="/build"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-8 py-4 rounded-xl text-lg font-medium transition-colors"
          >
            Start Building for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">AppForge</span>
          </div>
          <p className="text-sm text-gray-500">
            2026 AppForge. Built with Next.js, Expo, and AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
