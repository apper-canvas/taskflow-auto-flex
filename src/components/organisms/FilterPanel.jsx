import { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'
import Badge from '@/components/atoms/Badge'
import { tagService } from '@/services/api/tagService'

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClose, 
  tasks = [] 
}) => {
  const [allTags, setAllTags] = useState([])
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    tags: true,
    dates: false
  })

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const tags = await tagService.getAll()
      setAllTags(tags)
    } catch (error) {
      console.error("Failed to load tags:", error)
    }
  }

  // Get unique values from tasks
const uniqueOwners = [...new Set(tasks.map(task => task.Owner?.Name))].filter(Boolean)
  const uniqueCreators = [...new Set(tasks.map(task => task.CreatedBy?.Name))].filter(Boolean)

  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleTagToggle = (tagName) => {
    const currentTags = filters.tags || []
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName]
    
    handleFilterChange('tags', newTags)
  }

  const handleDateRangeChange = (field, value) => {
    handleFilterChange('dateRange', {
      ...filters.dateRange,
      [field]: value
    })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      owner: "",
      tags: [],
      createdBy: "",
      dateRange: { start: "", end: "" }
    })
  }

  const hasActiveFilters = filters.owner || 
    (filters.tags && filters.tags.length > 0) || 
    filters.createdBy || 
    filters.dateRange?.start || 
    filters.dateRange?.end

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getTagColor = (tagName) => {
const tag = allTags.find(t => t.Name === tagName)
    return tag?.color || "#3b82f6"
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 mb-6 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Filter" className="w-5 h-5 text-slate-600" />
            <h3 className="text-lg font-semibold text-slate-800">Filter Tasks</h3>
            {hasActiveFilters && (
              <Badge variant="primary" className="text-xs">
                Active
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-slate-500 hover:text-slate-700"
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              <ApperIcon name="ChevronUp" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <div className="p-6 space-y-6">
        {/* Basic Filters */}
        <div>
          <button
            onClick={() => toggleSection('basic')}
            className="flex items-center justify-between w-full mb-4 text-left"
          >
            <h4 className="text-sm font-semibold text-slate-700 flex items-center">
              <ApperIcon name="User" className="w-4 h-4 mr-2" />
              Basic Filters
            </h4>
            <ApperIcon 
              name={expandedSections.basic ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4 text-slate-500" 
            />
          </button>
          
          {expandedSections.basic && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner Filter */}
              <div>
                <Label>Filter by Owner</Label>
                <Select
                  value={filters.owner || ""}
                  onChange={(e) => handleFilterChange('owner', e.target.value)}
                >
                  <option value="">All owners</option>
                  {uniqueOwners.map(owner => (
                    <option key={owner} value={owner}>{owner}</option>
                  ))}
                </Select>
              </div>

              {/* Created By Filter */}
              <div>
                <Label>Filter by Creator</Label>
                <Select
                  value={filters.createdBy || ""}
                  onChange={(e) => handleFilterChange('createdBy', e.target.value)}
                >
                  <option value="">All creators</option>
                  {uniqueCreators.map(creator => (
                    <option key={creator} value={creator}>{creator}</option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Tags Filter */}
        <div>
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full mb-4 text-left"
          >
            <h4 className="text-sm font-semibold text-slate-700 flex items-center">
              <ApperIcon name="Tags" className="w-4 h-4 mr-2" />
              Filter by Tags
              {filters.tags && filters.tags.length > 0 && (
                <Badge variant="primary" className="ml-2 text-xs">
                  {filters.tags.length}
                </Badge>
              )}
            </h4>
            <ApperIcon 
              name={expandedSections.tags ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4 text-slate-500" 
            />
          </button>

          {expandedSections.tags && (
            <div className="space-y-3">
              {allTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag.Id}
                      onClick={() => handleTagToggle(tag.name)}
                      className={`transition-all duration-200 transform hover:scale-105 ${
                        filters.tags?.includes(tag.name) ? 'ring-2 ring-primary-300' : ''
                      }`}
                    >
                      <Badge
                        variant="custom"
                        color={tag.color}
                        className={`cursor-pointer ${
                          filters.tags?.includes(tag.name) 
                            ? 'opacity-100 shadow-md' 
                            : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        {tag.name}
                        {filters.tags?.includes(tag.name) && (
                          <ApperIcon name="Check" className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-500 py-4 text-center">
                  No tags available. Create tasks with tags to see them here.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('dates')}
            className="flex items-center justify-between w-full mb-4 text-left"
          >
            <h4 className="text-sm font-semibold text-slate-700 flex items-center">
              <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
              Date Range
              {(filters.dateRange?.start || filters.dateRange?.end) && (
                <Badge variant="primary" className="ml-2 text-xs">
                  Active
                </Badge>
              )}
            </h4>
            <ApperIcon 
              name={expandedSections.dates ? "ChevronUp" : "ChevronDown"} 
              className="w-4 h-4 text-slate-500" 
            />
          </button>

          {expandedSections.dates && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Created after</Label>
                <Input
                  type="date"
                  value={filters.dateRange?.start || ""}
                  onChange={(e) => handleDateRangeChange('start', e.target.value)}
                />
              </div>
              <div>
                <Label>Created before</Label>
                <Input
                  type="date"
                  value={filters.dateRange?.end || ""}
                  onChange={(e) => handleDateRangeChange('end', e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-3 border-t border-slate-200/70">
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-600">
            {hasActiveFilters ? "Filters applied" : "No filters applied"}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPanel