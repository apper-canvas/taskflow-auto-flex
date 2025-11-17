import { useState, useEffect } from 'react'
import TaskTable from '@/components/organisms/TaskTable'
import FilterPanel from '@/components/organisms/FilterPanel'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { taskService } from '@/services/api/taskService'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import Empty from '@/components/ui/Empty'

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filteredTasks, setFilteredTasks] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    owner: "",
    tags: [],
    createdBy: "",
    dateRange: { start: "", end: "" }
  })
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState({ key: "createdOn", direction: "desc" })

  // Load tasks
  const loadTasks = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
      setFilteredTasks(data)
    } catch (err) {
      setError("Failed to load tasks. Please try again.")
      console.error("Error loading tasks:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  // Filter and search tasks
  useEffect(() => {
    let filtered = [...tasks]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(task => 
task.Name?.toLowerCase().includes(query) ||
        task.Tags?.toLowerCase().includes(query) ||
        (task.Owner?.Name || '').toLowerCase().includes(query)
      )
    }

    // Apply filters
    if (filters.owner) {
filtered = filtered.filter(task => task.Owner?.Name === filters.owner)
    }

    if (filters.createdBy) {
filtered = filtered.filter(task => task.CreatedBy?.Name === filters.createdBy)
    }

    if (filters.tags.length > 0) {
filtered = filtered.filter(task => 
        filters.tags.some(filterTag => task.Tags?.includes(filterTag))
      )
    }

    if (filters.dateRange.start) {
      const startDate = new Date(filters.dateRange.start)
filtered = filtered.filter(task => new Date(task.CreatedOn) >= startDate)
    }

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end)
      filtered = filtered.filter(task => new Date(task.createdOn) <= endDate)
    }

    // Apply sorting
    filtered.sort((a, b) => {
let aVal = a[sortConfig.key] || (sortConfig.key === 'Owner' ? a.Owner?.Name : a[sortConfig.key])
      let bVal = b[sortConfig.key]

      // Handle dates
if (sortConfig.key === "CreatedOn" || sortConfig.key === "ModifiedOn") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      // Handle arrays (tags)
      if (Array.isArray(aVal)) {
        aVal = aVal.join(", ")
        bVal = bVal.join(", ")
      }

      // Handle strings
      if (typeof aVal === "string" && typeof bVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
      return 0
    })

    setFilteredTasks(filtered)
  }, [tasks, searchQuery, filters, sortConfig])

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ))
  }

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.Id !== taskId))
  }

  if (loading) return <Loading />
  if (error) return <ErrorView message={error} onRetry={loadTasks} />
  if (tasks.length === 0) return <Empty />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Task Management
            </h2>
            <p className="text-slate-600 mt-1">
              Manage and track your tasks with full audit trail
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            >
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filters
              {(filters.owner || filters.createdBy || filters.tags.length > 0 || filters.dateRange.start || filters.dateRange.end) && (
                <span className="ml-2 px-2 py-0.5 bg-accent-500 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {isFilterPanelOpen && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setIsFilterPanelOpen(false)}
          tasks={tasks}
        />
      )}

      {/* Results Summary */}
      <div className="mb-6 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-800">{filteredTasks.length}</span> of{" "}
          <span className="font-semibold text-slate-800">{tasks.length}</span> tasks
          {searchQuery && (
            <span className="ml-2 text-slate-500">
              for "{searchQuery}"
            </span>
          )}
        </div>
        
        {(searchQuery || Object.values(filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery("")
              setFilters({
owner: "",
                tags: [],
                createdBy: "",
                dateRange: { start: "", end: "" }
              })
            }}
            className="text-slate-500 hover:text-slate-700"
          >
            <ApperIcon name="X" className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        onTaskUpdate={handleTaskUpdate}
        onTaskDelete={handleTaskDelete}
        onSort={handleSort}
        sortConfig={sortConfig}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
    </div>
  )
}

export default Dashboard