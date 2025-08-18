"use client";

import { useState, useEffect } from "react";
import { useFilters } from "../../hooks/filters/useFilters";

interface FilterSettings {
  categories?: string[];
  lengths?: string[];
  tones?: string[];
  authors?: string[];
  dateFrom?: string;
  dateTo?: string;
  colors?: string[];
  sizes?: string[];
  materials?: string[];
  times?: string[];
  difficulties?: string[];
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: FilterSettings;
  onChange: (settings: FilterSettings) => void;
  onClear: () => void;
  filterType: "products" | "articles" | "recipes";
}

export default function FilterModal({
  isOpen,
  onClose,
  settings,
  onChange,
  onClear,
  filterType,
}: FilterModalProps) {
  const { data: filterValues, isLoading, error } = useFilters(filterType);
  
  // Локальное состояние для фильтров (не применяется до закрытия модала)
  const [localSettings, setLocalSettings] = useState<FilterSettings>(settings);

  // Синхронизируем локальное состояние с внешним при открытии модала
  useEffect(() => {
    if (isOpen) {
      setLocalSettings(settings);
    }
  }, [isOpen, settings]);

  // Применяем фильтры при закрытии модала
  const handleClose = () => {
    onChange(localSettings);
    onClose();
  };

  // Очищаем фильтры и применяем сразу
  const handleClear = () => {
    onClear();
    onClose();
  };

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div
        className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
        onClick={onClose}
      >
        <div
          className="bg-white md:rounded-t-3xl z-[9999] p-0 md:pt-5 relative w-full h-full md:h-auto md:max-w-6xl md:mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-500">Loading filters...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !filterValues) {
    return (
      <div
        className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
        onClick={onClose}
      >
        <div
          className="bg-white md:rounded-t-3xl z-[9999] p-0 md:pt-5 relative w-full h-full md:h-auto md:max-w-6xl md:mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center h-32">
            <div className="text-red-500">Error loading filters</div>
          </div>
        </div>
      </div>
    );
  }

  const handleToggle = (key: keyof FilterSettings, value: string) => {
    const arr = localSettings[key] ?? [];
    if (!Array.isArray(arr)) return;
    if (arr.includes(value)) {
      setLocalSettings({ ...localSettings, [key]: arr.filter((v: string) => v !== value) });
    } else {
      setLocalSettings({ ...localSettings, [key]: [...arr, value] });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
      onClick={handleClose}
    >
      <div
        className="bg-white  md:rounded-t-3xl z-[9999] p-0 md:pt-5 relative w-full h-full md:h-auto md:max-w-6xl md:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-coral hover:bg-coral hover:text-white transition-all duration-200 z-10"
          onClick={handleClose}
          aria-label="Close filter"
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-wrap gap-6 h-full md:max-h-[70vh] p-8 overflow-y-auto">
          {/* Categories */}
          <div className="min-w-[180px] flex-1">
            <div className="font-bold mb-3 text-charcoal">Category</div>
            <div className="flex flex-wrap gap-2">
              {filterValues.categories.map((cat: string) => (
                <button
                  key={cat}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    localSettings.categories?.includes(cat) 
                      ? "bg-coral text-white shadow-md" 
                      : "bg-gray-100 text-charcoal hover:bg-coral/10 hover:border-coral border border-transparent"
                  }`}
                  onClick={() => handleToggle("categories", cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Color filters (only for products) */}
          {filterType === "products" && filterValues.colors && filterValues.colors.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-3 text-charcoal">Color</div>
              <div className="flex flex-wrap gap-2">
                {filterValues.colors.map((color: string) => (
                  <button
                    key={color}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      localSettings.colors?.includes(color) 
                        ? "bg-coral text-white shadow-md" 
                        : "bg-gray-100 text-charcoal hover:bg-coral/10 hover:border-coral border border-transparent"
                    }`}
                    onClick={() => handleToggle("colors", color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size filters (only for products) */}
          {filterType === "products" && filterValues.sizes && filterValues.sizes.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-3 text-charcoal">Size</div>
              <div className="flex flex-wrap gap-2">
                {filterValues.sizes.map((size: string) => (
                  <button
                    key={size}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      localSettings.sizes?.includes(size) 
                        ? "bg-coral text-white shadow-md" 
                        : "bg-gray-100 text-charcoal hover:bg-coral/10 hover:border-coral border border-transparent"
                    }`}
                    onClick={() => handleToggle("sizes", size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Material filters (only for products) */}
          {filterType === "products" && filterValues.materials && filterValues.materials.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-3 text-charcoal">Material</div>
              <div className="flex flex-wrap gap-2">
                {filterValues.materials.map((material: string) => (
                  <button
                    key={material}
                    className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      localSettings.materials?.includes(material) 
                        ? "bg-coral text-white shadow-md" 
                        : "bg-gray-100 text-charcoal hover:bg-coral/10 hover:border-coral border border-transparent"
                    }`}
                    onClick={() => handleToggle("materials", material)}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          )}





          {/* Time filters (only for recipes) */}
          {filterType === "recipes" && filterValues.times && filterValues.times.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Time</div>
              {filterValues.times.map((time: string) => (
                              <button
                key={time}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.times?.includes(time) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("times", time)}
              >
                {time}
              </button>
              ))}
            </div>
          )}

          {/* Difficulty filters (only for recipes) */}
          {filterType === "recipes" && filterValues.difficulties && filterValues.difficulties.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Difficulty</div>
              {filterValues.difficulties.map((difficulty: string) => (
                              <button
                key={difficulty}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.difficulties?.includes(difficulty) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("difficulties", difficulty)}
              >
                {difficulty}
              </button>
              ))}
            </div>
          )}

          {/* Date filters (only for articles) */}
          {filterType === "articles" && (
            <div className="min-w-[180px] flex-1">
              <div className="font-bold mb-2">Date published</div>
              <div className="flex flex-col gap-2 mb-2 mr-4">
                <label className="text-xs font-medium text-gray-500" htmlFor="date-from">From</label>
                <input
                  id="date-from"
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={localSettings.dateFrom || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, dateFrom: e.target.value })}
                />
                <label className="text-xs font-medium text-gray-500" htmlFor="date-to">To</label>
                <input
                  id="date-to"
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={localSettings.dateTo || ""}
                  onChange={(e) => setLocalSettings({ ...localSettings, dateTo: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Length filters (only for articles) */}
          {filterType === "articles" && filterValues.lengths && filterValues.lengths.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Length</div>
              {filterValues.lengths.map((length: string) => (
                              <button
                key={length}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.lengths?.includes(length) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("lengths", length)}
              >
                {length}
              </button>
              ))}
            </div>
          )}

          {/* Tone filters (only for articles) */}
          {filterType === "articles" && filterValues.tones && filterValues.tones.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Tone</div>
              {filterValues.tones.map((tone: string) => (
                              <button
                key={tone}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.tones?.includes(tone) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("tones", tone)}
              >
                {tone}
              </button>
              ))}
            </div>
          )}

          {/* Author filters (only for articles) */}
          {filterType === "articles" && filterValues.authors && filterValues.authors.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Author</div>
              {filterValues.authors.map((author: string) => (
                              <button
                key={author}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.authors?.includes(author) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("authors", author)}
              >
                {author}
              </button>
              ))}
            </div>
          )}
        </div>

        {/* Clear button */}
        <div className="flex flex-col md:flex-row w-full items-end px-8 justify-center md:justify-end sticky bottom-0 bg-white py-6 border-t border-gray-100">
          <button
            className="px-6 py-3 rounded-full bg-gray-100 text-charcoal font-medium hover:bg-coral hover:text-white transition-all duration-200 border border-gray-200 hover:border-coral"
            onClick={handleClear}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
} 