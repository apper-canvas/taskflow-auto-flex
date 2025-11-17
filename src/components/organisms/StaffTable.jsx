import React, { useState, useMemo } from 'react'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Badge from '@/components/atoms/Badge'
import ConfirmDialog from '@/components/organisms/ConfirmDialog'
import { formatDistanceToNow } from 'date-fns'
import staffService from '@/services/api/staffService'

function StaffTable({ 
  staff = [], 
  onUpdate, 
  onDelete, 
  sortConfig, 
  onSort,
  selectedIds = [],
  onSelectionChange 
}) {
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null })
  const [saving, setSaving] = useState(false)

  // Export data for CSV download
  const exportData = useMemo(() => {
    return staff.map(member => ({
      Name: member.Name || '',
      Owner: member.Owner?.Name || '',
      Tags: member.Tags || '',
      CreatedBy: member.CreatedBy?.Name || '',
      CreatedOn: member.CreatedOn ? new Date(member.CreatedOn).toLocaleDateString() : '',
      ModifiedBy: member.ModifiedBy?.Name || '',
      ModifiedOn: member.ModifiedOn ? new Date(member.ModifiedOn).toLocaleDateString() : ''
    }))
  }, [staff])

  const handleEdit = (member) => {
    setEditingId(member.Id)
    setEditForm({
      Name: member.Name || '',
      Tags: member.Tags || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditForm({})
  }

  const handleSave = async () => {
    if (!editingId || saving) return

    setSaving(true)
    try {
      const updateData = {}
      
      // Only include fields that have changed
      const originalMember = staff.find(t => t.Id === editingId)
      if (editForm.Name !== originalMember?.Name) {
        updateData.Name = editForm.Name?.trim()
      }
      if (editForm.Tags !== originalMember?.Tags) {
        updateData.Tags = editForm.Tags?.trim()
      }

      // Only update if there are actual changes
      if (Object.keys(updateData).length === 0) {
        handleCancelEdit()
        return
      }

      const updated = await staffService.update(editingId, updateData)
      
      if (updated) {
        toast.success('Staff member updated successfully')
        onUpdate()
        handleCancelEdit()
      } else {
        toast.error('Failed to update staff member')
      }
    } catch (error) {
      console.error('Error updating staff:', error)
      toast.error('Failed to update staff member')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.id) return

    try {
      const success = await staffService.delete(deleteDialog.id)
      
      if (success) {
        toast.success('Staff member deleted successfully')
        onDelete()
      } else {
        toast.error('Failed to delete staff member')
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast.error('Failed to delete staff member')
    }
    
    setDeleteDialog({ open: false, id: null })
  }

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    try {
      const success = await staffService.delete(selectedIds)
      
      if (success) {
        toast.success(`${selectedIds.length} staff members deleted successfully`)
        onDelete()
        onSelectionChange([])
      } else {
        toast.error('Failed to delete selected staff members')
      }
    } catch (error) {
      console.error('Error deleting staff:', error)
      toast.error('Failed to delete selected staff members')
    }
  }

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <ApperIcon name="ArrowUpDown" size={14} className="opacity-50" />
    }
    return sortConfig.direction === 'asc' 
      ? <ApperIcon name="ArrowUp" size={14} className="text-blue-600" />
      : <ApperIcon name="ArrowDown" size={14} className="text-blue-600" />
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Invalid date'
    }
  }

  const downloadCSV = () => {
    const headers = ['Name', 'Owner', 'Tags', 'Created By', 'Created On', 'Modified By', 'Modified On']
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(h => `"${row[h.replace(' ', '')]}"`).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'staff.csv'
    link.click()
  }

  if (staff.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border">
        <ApperIcon name="Users" size={48} className="mx-auto text-slate-400 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No staff members</h3>
        <p className="text-slate-600">Create your first staff member to get started.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="border-b bg-blue-50 px-6 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-blue-900">
            {selectedIds.length} staff member{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleBulkDelete}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" size={16} className="mr-1" />
              Delete Selected
            </Button>
            <Button
              onClick={() => onSelectionChange([])}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Actions Bar */}
      <div className="border-b px-6 py-3 flex items-center justify-between bg-slate-50">
        <div className="text-sm text-slate-600">
          {staff.length} staff member{staff.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={downloadCSV} variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-1" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length === staff.length}
                  onChange={(e) => {
                    onSelectionChange(
                      e.target.checked ? staff.map(t => t.Id) : []
                    )
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="text-left px-6 py-3 w-64">
                <button
                  onClick={() => onSort("Name")}
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <span>Name</span>
                  {getSortIcon("Name")}
                </button>
              </th>
              <th className="text-left px-6 py-3 w-48">
                <button
                  onClick={() => onSort("Owner")}
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <span>Owner</span>
                  {getSortIcon("Owner")}
                </button>
              </th>
              <th className="text-left px-6 py-3">
                <div className="text-sm font-semibold text-slate-700">Tags</div>
              </th>
              <th className="text-left px-6 py-3 w-40">
                <button
                  onClick={() => onSort("CreatedBy")}
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <span>Created By</span>
                  {getSortIcon("CreatedBy")}
                </button>
              </th>
              <th className="text-left px-6 py-3 w-32">
                <button
                  onClick={() => onSort("CreatedOn")}
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <span>Created</span>
                  {getSortIcon("CreatedOn")}
                </button>
              </th>
              <th className="text-left px-6 py-3 w-32">
                <button
                  onClick={() => onSort("ModifiedOn")}
                  className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
                >
                  <span>Modified</span>
                  {getSortIcon("ModifiedOn")}
                </button>
              </th>
              <th className="w-24 px-6 py-3">
                <div className="text-sm font-semibold text-slate-700">Actions</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.Id} className="border-b hover:bg-slate-50 table-row-hover">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(member.Id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        onSelectionChange([...selectedIds, member.Id])
                      } else {
                        onSelectionChange(selectedIds.filter(id => id !== member.Id))
                      }
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                
                {/* Name */}
                <td className="px-6 py-4">
                  {editingId === member.Id ? (
                    <Input
                      value={editForm.Name || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, Name: e.target.value}))}
                      className="w-full inline-edit-field"
                      placeholder="Staff member name"
                    />
                  ) : (
                    <div className="font-medium text-slate-900">
                      {member.Name || 'Unnamed Staff'}
                    </div>
                  )}
                </td>
                
                {/* Owner */}
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {member.Owner?.Name || 'Unassigned'}
                  </div>
                </td>
                
                {/* Tags */}
                <td className="px-6 py-4">
                  {editingId === member.Id ? (
                    <Input
                      value={editForm.Tags || ''}
                      onChange={(e) => setEditForm(prev => ({...prev, Tags: e.target.value}))}
                      className="w-full inline-edit-field"
                      placeholder="Tags (comma separated)"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {member.Tags ? member.Tags.split(',').filter(Boolean).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      )) : (
                        <span className="text-sm text-slate-400">No tags</span>
                      )}
                    </div>
                  )}
                </td>
                
                {/* Created By */}
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {member.CreatedBy?.Name || 'System'}
                  </div>
                </td>
                
                {/* Created */}
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {formatDate(member.CreatedOn)}
                  </div>
                </td>
                
                {/* Modified */}
                <td className="px-6 py-4">
                  <div className="text-sm text-slate-600">
                    {formatDate(member.ModifiedOn)}
                  </div>
                </td>
                
                {/* Actions */}
                <td className="px-6 py-4">
                  {editingId === member.Id ? (
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={saving}
                        className="px-2 py-1"
                      >
                        {saving ? <ApperIcon name="Loader2" size={14} className="animate-spin" /> : <ApperIcon name="Check" size={14} />}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        size="sm"
                        disabled={saving}
                        className="px-2 py-1"
                      >
                        <ApperIcon name="X" size={14} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Button
                        onClick={() => handleEdit(member)}
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ApperIcon name="Edit2" size={14} />
                      </Button>
                      <Button
                        onClick={() => setDeleteDialog({ open: true, id: member.Id })}
                        variant="ghost"
                        size="sm"
                        className="px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={14} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger
      />
    </div>
  )
}

export default StaffTable