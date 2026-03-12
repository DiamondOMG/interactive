import React from 'react';

export default function SectionFilter({
  currentSection,
  onSectionChange,
}: {
  currentSection: string;
  onSectionChange: (section: string) => void;
}) {
  const sections = [
    { id: "all", label: "All", count: null },
    { id: "main_area", label: "Main Area", count: null },
    { id: "shelf", label: "Shelf", count: null },
  ];

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            currentSection === section.id
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          {section.label}
        </button>
      ))}
    </div>
  );
}
