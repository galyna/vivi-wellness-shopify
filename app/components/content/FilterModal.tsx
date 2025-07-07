"use client";

import { useState, useEffect } from "react";
import { useFilters } from "../../hooks/useFilters";

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
  minPrice?: string;
  maxPrice?: string;
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
          className="absolute top-2 right-4 text-2xl text-coral z-10"
          onClick={handleClose}
          aria-label="Close filter"
          type="button"
        >
          ×
        </button>

        <div className="flex flex-wrap gap-4 h-full md:max-h-[70vh] p-8 overflow-y-auto">
          {/* Categories */}
          <div className="min-w-[180px] flex-1">
            <div className="font-bold mb-2">Category</div>
            {filterValues.categories.map((cat: string) => (
              <button
                key={cat}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.categories?.includes(cat) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("categories", cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Price filters (only for products) */}
          {filterType === "products" && (
            <div className="min-w-[180px] flex-1">
              <div className="font-bold mb-2">Price</div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500 min-w-[30px]">Min</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="border rounded px-2 py-1 w-20"
                    value={localSettings.minPrice || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, minPrice: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500 min-w-[30px]">Max</label>
                  <input
                    type="number"
                    placeholder="∞"
                    className="border rounded px-2 py-1 w-20"
                    value={localSettings.maxPrice || ""}
                    onChange={(e) => setLocalSettings({ ...localSettings, maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Color filters (only for products) */}
          {filterType === "products" && filterValues.colors && filterValues.colors.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Color</div>
              {filterValues.colors.map((color: string) => (
                              <button
                key={color}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.colors?.includes(color) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("colors", color)}
              >
                {color}
              </button>
              ))}
            </div>
          )}

          {/* Size filters (only for products) */}
          {filterType === "products" && filterValues.sizes && filterValues.sizes.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Size</div>
              {filterValues.sizes.map((size: string) => (
                              <button
                key={size}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.sizes?.includes(size) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("sizes", size)}
              >
                {size}
              </button>
              ))}
            </div>
          )}

          {/* Material filters (only for products) */}
          {filterType === "products" && filterValues.materials && filterValues.materials.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Material</div>
              {filterValues.materials.map((material: string) => (
                              <button
                key={material}
                className={`block w-full text-left px-3 py-2 rounded ${
                  localSettings.materials?.includes(material) 
                    ? "bg-coral text-white" 
                    : "hover:bg-gray-100"
                }`}
                onClick={() => handleToggle("materials", material)}
              >
                {material}
              </button>
              ))}
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
        <div className="flex flex-col md:flex-row w-full items-end px-14 justify-center md:justify-end sticky bottom-0 bg-white py-4 border-t border-gray-100">
          <button
            className="px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors border border-gray-200"
            onClick={handleClear}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
} 