const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-64 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg skeleton mb-2"></div>
            <div className="h-5 w-96 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton"></div>
          </div>
          <div className="h-10 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg skeleton"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/70">
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton"></div>
            ))}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 8 }).map((_, rowIndex) => (
            <div key={rowIndex} className="px-6 py-4">
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* Task Name */}
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton w-3/4"></div>
                
                {/* Owner */}
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton w-2/3"></div>
                
                {/* Tags */}
                <div className="flex space-x-2">
                  <div className="h-6 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full skeleton"></div>
                  <div className="h-6 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full skeleton"></div>
                </div>
                
                {/* Created By */}
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton w-2/3"></div>
                
                {/* Created Date */}
                <div className="h-5 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton w-1/2"></div>
                
                {/* Actions */}
                <div className="flex space-x-2 justify-end">
                  <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton"></div>
                  <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded skeleton"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Animation Indicator */}
      <div className="flex items-center justify-center mt-8">
        <div className="flex items-center space-x-3 text-slate-500">
          <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-medium">Loading tasks...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading