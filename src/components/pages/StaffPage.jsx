import React, { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import StaffTable from '@/components/organisms/StaffTable'
import CreateStaffModal from '@/components/organisms/CreateStaffModal'
import Loading from '@/components/ui/Loading'
import ErrorView from '@/components/ui/ErrorView'
import staffService from '@/services/api/staffService'

function StaffPage() {
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: 'ModifiedOn', direction: 'desc' })
  const [selectedIds, setSelectedIds] = useState([])
  const [createModalOpen, setCreateModalOpen] = useState(false)

  // Load staff data
  const loadStaff = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await staffService.getAll()
      setStaff(data)
    } catch (err) {
      console.error('Error loading staff:', err)
      setError('Failed to load staff. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStaff()
  }, [])

  // Filter and sort staff
  const filteredAndSortedStaff = useMemo(() => {
    let filtered = [...staff]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(member => 
        member.Name?.toLowerCase().includes(query) ||
        member.Tags?.toLowerCase().includes(query) ||
        (member.Owner?.Name || '').toLowerCase().includes(query) ||
        (member.CreatedBy?.Name || '').toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key]
        let bVal = b[sortConfig.key]
        
        // Handle lookup fields
        if (sortConfig.key === 'Owner' || sortConfig.key === 'CreatedBy' || sortConfig.key === 'ModifiedBy') {
          aVal = a[sortConfig.key]?.Name || ''
          bVal = b[sortConfig.key]?.Name || ''
        }
        
        // Handle dates
        if (sortConfig.key === 'CreatedOn' || sortConfig.key === 'ModifiedOn') {
          aVal = new Date(aVal || 0)
          bVal = new Date(bVal || 0)
        }
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [staff, searchQuery, sortConfig])

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleRefresh = () => {
    loadStaff()
    toast.success('Staff list refreshed')
  }

  const handleStaffCreated = () => {
    loadStaff()
    setSelectedIds([])
  }

  const handleStaffUpdated = () => {
    loadStaff()
  }

  const handleStaffDeleted = () => {
    loadStaff()
    setSelectedIds([])
  }

  if (loading) {
    return <Loading message="Loading staff..." />
  }

  if (error) {
    return (
      <ErrorView 
        message={error}
        onRetry={loadStaff}
      />
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center">
              <ApperIcon name="Users" size={28} className="mr-3" />
              Staff Management
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your team members and their information
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleRefresh}
              variant="outline"
            >
              <ApperIcon name="RefreshCw" size={16} className="mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setCreateModalOpen(true)}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Staff
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search staff by name, tags, or owner..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
              <p className="text-sm text-slate-600">Total Staff</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserCheck" size={24} className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">
                {filteredAndSortedStaff.length}
              </p>
              <p className="text-sm text-slate-600">Visible</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="Tags" size={24} className="text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">
                {new Set(staff.flatMap(s => s.Tags ? s.Tags.split(',').map(t => t.trim()).filter(Boolean) : [])).size}
              </p>
              <p className="text-sm text-slate-600">Unique Tags</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-slate-900">{selectedIds.length}</p>
              <p className="text-sm text-slate-600">Selected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <StaffTable
        staff={filteredAndSortedStaff}
        onUpdate={handleStaffUpdated}
        onDelete={handleStaffDeleted}
        sortConfig={sortConfig}
        onSort={handleSort}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Create Staff Modal */}
      <CreateStaffModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={handleStaffCreated}
      />
    </div>
  )
}

export default StaffPage