'use client';

interface ExportButtonProps {
  isVisible: boolean;
  onExport: () => void;
  isDarkMode: boolean;
}

export default function ExportButton({ isVisible, onExport, isDarkMode }: ExportButtonProps) {
  const borderColor = isDarkMode ? 'border-white' : 'border-black';
  const hoverBg = isDarkMode ? 'hover:bg-white hover:text-black' : 'hover:bg-black hover:text-white';

  return (
    <button
      onClick={onExport}
      className={`px-6 py-2 text-sm font-medium border rounded-full transition-all duration-300 ease-out ${borderColor} ${hoverBg} ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      Export PDF
    </button>
  );
}
