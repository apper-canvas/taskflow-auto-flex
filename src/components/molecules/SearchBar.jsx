import { useState, useRef, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import { cn } from '@/utils/cn'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search tasks, tags, owners...", 
  className = "",
  defaultValue = ""
}) => {
  const [query, setQuery] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (onSearch) {
        onSearch(query)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery("")
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      inputRef.current?.blur()
      setQuery("")
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "relative flex items-center transition-all duration-200",
        isFocused ? "scale-[1.02]" : ""
      )}>
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors duration-200"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full pl-10 pr-10 py-2.5 text-sm bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg shadow-sm transition-all duration-200",
            "placeholder:text-slate-400",
            "hover:border-slate-300 hover:shadow-md",
            "focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 focus:bg-white focus:shadow-lg",
            isFocused ? "ring-2 ring-primary-100 border-primary-400 bg-white shadow-lg" : ""
          )}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0.5 hover:bg-slate-100 rounded-full transition-colors duration-200"
            type="button"
          >
            <ApperIcon name="X" className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {/* Search suggestions indicator */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-slate-500 bg-white/95 backdrop-blur-sm rounded-md border border-slate-100 px-3 py-2 shadow-lg z-10">
          Searching for "{query}" in tasks, tags, and owners
        </div>
      )}
    </div>
  )
}

export default SearchBar