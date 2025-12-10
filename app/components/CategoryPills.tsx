'use client';

import { categories, Category } from '@/app/lib/prompts';

interface CategoryPillsProps {
  selectedCategory: Category | null;
  onSelectCategory: (category: Category) => void;
  onStart: () => void;
  isVisible: boolean;
  isDarkMode: boolean;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
  onStart,
  isVisible,
  isDarkMode,
}: CategoryPillsProps) {
  const borderColor = isDarkMode ? 'border-white' : 'border-black';
  const hoverBg = isDarkMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white';
  const selectedBg = isDarkMode ? 'bg-white text-black' : 'bg-black text-white';
  const unselectedBg = 'bg-transparent';

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen overflow-hidden transition-all duration-300 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-center items-center gap-3 px-4 max-w-full">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ease-out border rounded-full whitespace-nowrap ${borderColor} ${
              selectedCategory === category
                ? selectedBg
                : `${unselectedBg} ${hoverBg}`
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <button
        onClick={onStart}
        disabled={!selectedCategory}
        className={`mt-8 px-6 py-2 text-sm font-medium transition-all duration-300 ease-out border rounded-full ${borderColor} ${hoverBg} ${
          selectedCategory
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        Start
      </button>
    </div>
  );
}
