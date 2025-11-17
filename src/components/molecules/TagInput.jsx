import { useState, useRef, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import { tagService } from '@/services/api/tagService'

const TagInput = ({ 
  value = [], 
  onChange, 
  placeholder = "Add tags...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [allTags, setAllTags] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTagColor, setSelectedTagColor] = useState("#3b82f6")
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Color options for new tags
  const colorOptions = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"
  ]

  useEffect(() => {
    loadTags()
  }, [])

  useEffect(() => {
    if (inputValue) {
const filtered = allTags.filter(tag => 
        tag.Name?.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(tag.Name)
      )
      setSuggestions(filtered)
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
  }, [inputValue, allTags, value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadTags = async () => {
    try {
      const tags = await tagService.getAll()
      setAllTags(tags)
    } catch (error) {
      console.error("Failed to load tags:", error)
    }
  }

  const handleAddTag = async (tagName, color = selectedTagColor) => {
    if (!tagName.trim() || value.includes(tagName.trim())) return

    const trimmedName = tagName.trim()
    
    // Check if tag exists, if not create it
let existingTag = allTags.find(tag => tag.Name?.toLowerCase() === trimmedName.toLowerCase())
    
    if (!existingTag) {
      try {
        const newTag = await tagService.create({
Name: trimmedName,
          color_c: color
        })
        setAllTags(prev => [...prev, newTag])
        existingTag = newTag
      } catch (error) {
        console.error("Failed to create tag:", error)
        return
      }
    }

onChange([...value, existingTag.Name])
    setInputValue("")
    setIsOpen(false)
  }

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (inputValue.trim()) {
        handleAddTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const getTagColor = (tagName) => {
const tag = allTags.find(t => t.Name === tagName)
    return tag?.color || "#3b82f6"
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tags */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`}
              variant="custom"
              color={getTagColor(tag)}
              className="group cursor-pointer hover:opacity-80 transition-opacity"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1.5 opacity-60 hover:opacity-100 transition-opacity"
                type="button"
              >
                <ApperIcon name="X" className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 hover:border-slate-400"
        />
        {inputValue && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {/* Color Picker for New Tags */}
            <div className="flex space-x-1">
              {colorOptions.slice(0, 5).map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedTagColor(color)}
                  className={`w-4 h-4 rounded-full border-2 transition-all ${
                    selectedTagColor === color ? 'border-slate-400 scale-110' : 'border-slate-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {/* Create New Tag Option */}
{inputValue && !allTags.some(tag => tag.Name?.toLowerCase() === inputValue.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleAddTag(inputValue)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2 border-b border-slate-100"
            >
              <ApperIcon name="Plus" className="w-4 h-4 text-slate-400" />
              <span>Create "{inputValue}"</span>
              <div 
                className="w-3 h-3 rounded-full ml-auto"
                style={{ backgroundColor: selectedTagColor }}
              />
            </button>
          )}

          {/* Existing Tag Suggestions */}
{suggestions.map((tag, index) => (
            <button
              key={`${tag.Id}-${index}`}
              type="button"
              onClick={() => handleAddTag(tag.name, tag.color)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 flex items-center space-x-2"
            >
              <div 
className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
              <span>{tag.Name}</span>
            </button>
          ))}

          {/* No Results */}
{inputValue && suggestions.length === 0 && allTags.some(tag => tag.Name?.toLowerCase() === inputValue.toLowerCase()) && (
            <div className="px-3 py-2 text-sm text-slate-500">
              Tag already exists or selected
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TagInput