export function Skeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((_, i) => (
          <div key={i} className="relative group bg-white rounded-3xl shadow p-0 overflow-hidden flex flex-col h-full animate-pulse">
            {/* Картинка */}
            <div className="relative w-full aspect-[4/3] bg-gray-200 rounded-3xl" />
            {/* Контент */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="h-4 bg-gray-100 rounded mb-2 w-1/3" />
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4" />
              </div>
              <div className="h-5 bg-gray-100 rounded w-1/4 mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }