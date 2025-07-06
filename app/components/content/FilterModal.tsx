"use client";

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

// Utility function to extract unique filter values
function extractFilterValues<T extends { category?: string }>(data: T[], filterType: "products" | "articles" | "recipes") {
  const categories = [...new Set(data.map(item => item.category).filter((x): x is string => Boolean(x)))];
  
  if (filterType === "products") {
    return {
      categories,
      colors: [...new Set(data.map(item => (item as T & { color?: string }).color).filter((x): x is string => Boolean(x)))],
      sizes: [...new Set(data.map(item => (item as T & { size?: string }).size).filter((x): x is string => Boolean(x)))],
      materials: [...new Set(data.map(item => (item as T & { material?: string }).material).filter((x): x is string => Boolean(x)))],
    };
  }
  
  if (filterType === "recipes") {
    return {
      categories,
      times: [...new Set(data.map(item => (item as T & { time?: string }).time).filter((x): x is string => Boolean(x)))],
      difficulties: [...new Set(data.map(item => (item as T & { difficulty?: string }).difficulty).filter((x): x is string => Boolean(x)))],
    };
  }
  
  if (filterType === "articles") {
    return {
      categories,
      lengths: [...new Set(data.map(item => (item as T & { length?: string }).length).filter((x): x is string => Boolean(x)))],
      tones: [...new Set(data.map(item => (item as T & { tone?: string }).tone).filter((x): x is string => Boolean(x)))],
      authors: [...new Set(data.map(item => (item as T & { author?: string }).author).filter((x): x is string => Boolean(x)))],
    };
  }
  
  return { categories };
}

interface FilterModalProps<T extends { category?: string }> {
  isOpen: boolean;
  onClose: () => void;
  settings: FilterSettings;
  onChange: (settings: FilterSettings) => void;
  onClear: () => void;
  filterType: "products" | "articles" | "recipes";
  data: T[];
}

export default function FilterModal<T extends { category?: string }>({
  isOpen,
  onClose,
  settings,
  onChange,
  onClear,
  filterType,
  data,
}: FilterModalProps<T>) {
  if (!isOpen) return null;

  const filterValues = extractFilterValues(data, filterType);

  const handleToggle = (key: keyof FilterSettings, value: string) => {
    const arr = settings[key] ?? [];
    if (!Array.isArray(arr)) return;
    if (arr.includes(value)) {
      onChange({ ...settings, [key]: arr.filter((v: string) => v !== value) });
    } else {
      onChange({ ...settings, [key]: [...arr, value] });
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-end"
      onClick={onClose}
    >
      <div
        className="bg-white  md:rounded-t-3xl z-[9999] p-0 md:pt-5 relative w-full h-full md:h-auto md:max-w-6xl md:mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-4 text-2xl text-coral z-10"
          onClick={onClose}
          aria-label="Close filter"
          type="button"
        >
          ×
        </button>

        <div className="flex flex-wrap gap-4 h-full md:max-h-[70vh] p-8 overflow-y-auto">
          {/* Categories */}
          <div className="min-w-[180px] flex-1">
            <div className="font-bold mb-2">Category</div>
            {filterValues.categories.map((cat) => (
              <button
                key={cat}
                className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                  settings.categories?.includes(cat) ? "bg-coral text-white" : ""
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
                    value={settings.minPrice || ""}
                    onChange={(e) => onChange({ ...settings, minPrice: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-gray-500 min-w-[30px]">Max</label>
                  <input
                    type="number"
                    placeholder="∞"
                    className="border rounded px-2 py-1 w-20"
                    value={settings.maxPrice || ""}
                    onChange={(e) => onChange({ ...settings, maxPrice: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Color filters (only for products) */}
          {filterType === "products" && filterValues.colors && filterValues.colors.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Color</div>
              {filterValues.colors.map((color) => (
                <button
                  key={color}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.colors?.includes(color) ? "bg-coral text-white" : ""
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
              {filterValues.sizes.map((size) => (
                <button
                  key={size}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.sizes?.includes(size) ? "bg-coral text-white" : ""
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
              {filterValues.materials.map((material) => (
                <button
                  key={material}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.materials?.includes(material) ? "bg-coral text-white" : ""
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
              {filterValues.times.map((time) => (
                <button
                  key={time}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.times?.includes(time) ? "bg-coral text-white" : ""
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
              {filterValues.difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.difficulties?.includes(difficulty) ? "bg-coral text-white" : ""
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
                  value={settings.dateFrom || ""}
                  onChange={(e) => onChange({ ...settings, dateFrom: e.target.value })}
                />
                <label className="text-xs font-medium text-gray-500" htmlFor="date-to">To</label>
                <input
                  id="date-to"
                  type="date"
                  className="border rounded px-2 py-1 w-full"
                  value={settings.dateTo || ""}
                  onChange={(e) => onChange({ ...settings, dateTo: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Length filters (only for articles) */}
          {filterType === "articles" && filterValues.lengths && filterValues.lengths.length > 0 && (
            <div className="min-w-[140px] flex-1">
              <div className="font-bold mb-2">Length</div>
              {filterValues.lengths.map((length) => (
                <button
                  key={length}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.lengths?.includes(length) ? "bg-coral text-white" : ""
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
              {filterValues.tones.map((tone) => (
                <button
                  key={tone}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.tones?.includes(tone) ? "bg-coral text-white" : ""
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
              {filterValues.authors.map((author) => (
                <button
                  key={author}
                  className={`block w-full text-left px-3 py-2 rounded hover:bg-gray-100 ${
                    settings.authors?.includes(author) ? "bg-coral text-white" : ""
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
            onClick={onClear}
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>
  );
} 