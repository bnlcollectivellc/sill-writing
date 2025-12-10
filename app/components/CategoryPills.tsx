'use client';

import { categories, Category } from '@/app/lib/prompts';

interface CategoryPillsProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onStart: () => void;
  isVisible: boolean;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
  onStart,
  isVisible,
}: CategoryPillsProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className="flex flex-wrap justify-center gap-3 max-w-2xl px-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ease-out border border-white rounded-full ${
              selectedCategory === category
                ? 'bg-white text-black'
                : 'bg-transparent text-white hover:bg-white hover:text-black'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={!selectedCategory}
        className={`mt-8 px-6 py-2 text-sm font-medium transition-all duration-300 ease-out ${
          selectedCategory
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        } border border-white rounded-full hover:bg-white hover:text-black`}
      >
        Start
      </button>
    </div>
  );
}
