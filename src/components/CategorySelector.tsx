"use client";

import { useState } from "react";
import {
  ShoppingBag,
  Users,
  Heart,
  CheckSquare,
  DollarSign,
  Utensils,
  BookOpen,
  Map,
  Play,
  Wand2,
  X,
  Sparkles,
} from "lucide-react";
import { APP_CATEGORIES, AppCategory } from "@/lib/app-templates";

// Map icon names to components
const iconMap: Record<string, React.ComponentType<any>> = {
  ShoppingBag,
  Users,
  Heart,
  CheckSquare,
  DollarSign,
  Utensils,
  BookOpen,
  Map,
  Play,
  Wand2,
};

interface CategorySelectorProps {
  selectedCategory: AppCategory | null;
  onSelectCategory: (category: AppCategory | null) => void;
  onSelectPrompt: (prompt: string) => void;
}

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
  onSelectPrompt,
}: CategorySelectorProps) {
  const [showModal, setShowModal] = useState(false);

  const handleCategorySelect = (category: AppCategory) => {
    onSelectCategory(category);
    setShowModal(false);
  };

  const IconComponent = selectedCategory
    ? iconMap[selectedCategory.icon] || Wand2
    : Sparkles;

  return (
    <>
      {/* Category Button */}
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 bg-[#1a1a1a] border border-[#333] rounded-lg px-3 py-2 text-sm w-full hover:border-purple-500/50 transition-colors group"
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{
            backgroundColor: selectedCategory
              ? `${selectedCategory.color}20`
              : "#7c3aed20",
          }}
        >
          <IconComponent
            className="w-3.5 h-3.5"
            style={{
              color: selectedCategory?.color || "#7c3aed",
            }}
          />
        </div>
        <span className="flex-1 text-left truncate">
          {selectedCategory?.name || "Choose App Type"}
        </span>
        <span className="text-xs text-gray-500 group-hover:text-gray-400">
          Change
        </span>
      </button>

      {/* Example Prompts for Selected Category */}
      {selectedCategory && selectedCategory.id !== "custom" && (
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1.5">Quick start:</p>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategory.examplePrompts.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPrompt(prompt)}
                className="text-xs bg-[#1a1a1a] border border-[#333] rounded-full px-2.5 py-1 hover:border-purple-500/50 hover:text-purple-400 transition-colors truncate max-w-full"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-[#222] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#222]">
              <div>
                <h3 className="text-lg font-semibold">What are you building?</h3>
                <p className="text-sm text-gray-400">
                  Choose a category for smarter AI suggestions
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-[#222] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories Grid */}
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {APP_CATEGORIES.map((category) => {
                  const Icon = iconMap[category.icon] || Wand2;
                  const isSelected = selectedCategory?.id === category.id;

                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`flex flex-col items-center p-4 rounded-xl border transition-all text-center group ${
                        isSelected
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-[#333] hover:border-[#444] hover:bg-[#1a1a1a]"
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: `${category.color}20`,
                        }}
                      >
                        <Icon
                          className="w-6 h-6"
                          style={{ color: category.color }}
                        />
                      </div>
                      <span className="font-medium text-sm mb-1">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 line-clamp-2">
                        {category.description}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Features Preview */}
              {selectedCategory && selectedCategory.id !== "custom" && (
                <div className="mt-4 p-4 bg-[#1a1a1a] rounded-xl border border-[#333]">
                  <p className="text-sm font-medium mb-2">
                    Common features for {selectedCategory.name}:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.commonFeatures.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${selectedCategory.color}20`,
                          color: selectedCategory.color,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#222] flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSelectCategory(selectedCategory);
                  setShowModal(false);
                }}
                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
