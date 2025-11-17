import React, { useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '@/components/organisms/Modal'
import FormField from '@/components/molecules/FormField'
import TagInput from '@/components/molecules/TagInput'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import staffService from '@/services/api/staffService'

function CreateStaffModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    tags: ""
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name?.trim()) {
      newErrors.name = "Staff name is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const staffData = {
        Name: formData.name.trim(),
        Tags: formData.tags,
      }

      const created = await staffService.create(staffData)
      
      if (created) {
        toast.success('Staff member created successfully')
        onSuccess()
        handleClose()
      } else {
        toast.error('Failed to create staff member')
      }
    } catch (error) {
      console.error('Error creating staff:', error)
      toast.error('Failed to create staff member')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      name: "",
      tags: ""
    })
    setErrors({})
    onClose()
  }

  const handleTagsChange = (tags) => {
    setFormData(prev => ({
      ...prev,
      tags: tags.join(', ')
    }))
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <ApperIcon name="UserPlus" size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Add New Staff Member</h2>
              <p className="text-sm text-slate-600">Create a new staff member profile</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Staff Name */}
          <FormField
            label="Staff Name"
            error={errors.name}
            required
          >
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter staff member name"
            />
          </FormField>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tags
              <span className="text-slate-500 font-normal ml-1">(Optional)</span>
            </label>
            <TagInput
              value={formData.tags ? formData.tags.split(', ').filter(Boolean) : []}
              onChange={handleTagsChange}
              placeholder="Add tags for this staff member..."
            />
          </div>

          {/* Creator Info */}
          <div className="bg-slate-50 rounded-lg p-4 border">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <ApperIcon name="User" size={16} />
              <div>
                <span className="font-medium">Created by:</span> Current User
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Create Staff Member
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CreateStaffModal