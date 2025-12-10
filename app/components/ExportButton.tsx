'use client';

interface ExportButtonProps {
  isVisible: boolean;
  onExport: () => void;
}

export default function ExportButton({ isVisible, onExport }: ExportButtonProps) {
  return (
    <button
      onClick={onExport}
      className={`mt-4 px-6 py-2 text-sm font-medium border border-white rounded-full transition-all duration-300 ease-out hover:bg-white hover:text-black ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      Export PDF
    </button>
  );
}
