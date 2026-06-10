export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-9 w-48 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-5 w-72 bg-gray-100 rounded animate-pulse" />
      </div>
      {/* Filtros skeleton */}
      <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse mb-8" />
      {/* Cards skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card flex overflow-hidden h-40">
            <div className="w-36 bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 p-4 space-y-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
