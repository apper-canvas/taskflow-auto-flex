import React, { useState } from "react";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import ApperIcon from "@/components/ApperIcon";
import TagInput from "@/components/molecules/TagInput";
import Modal from "@/components/organisms/Modal";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const CreateTaskModal = ({ isOpen, onClose }) => {
const [formData, setFormData] = useState({
    name: "",
    tags: ""
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Task name is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setLoading(true)
      
const newTask = await taskService.create({
        Name: formData.name.trim(),
        Tags: formData.tags,
        status_c: "active",
        status: "active"
      })

      toast.success("Task created successfully!")
      handleClose()
      
      // Refresh the page to show the new task
      window.location.reload()
      
    } catch (error) {
      toast.error("Failed to create task. Please try again.")
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

const handleClose = () => {
    setFormData({ name: "", tags: "" })
    setErrors({})
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="space-y-6" onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl">
            <ApperIcon name="Plus" className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Create New Task</h2>
            <p className="text-slate-600">Add a new task with owner and tags</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Name */}
          <div>
            <Label required>Task Name</Label>
<Input
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter task name"
              error={errors.name}
              className="text-base"
              autoFocus
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

{/* Tags (Input) */}
          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas"
              error={errors.tags}
              className="text-base"
            />
            {errors.tags && (
              <p className="text-sm text-red-600 mt-1 flex items-center">
                <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
                {errors.tags}
              </p>
            )}
          </div>

          {/* Tags (Visual) */}
<Input
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags (comma separated)"
              error={errors.tags}
              className="text-base"
            />

          {/* Tags */}
          <div>
            <Label>Tags</Label>
<TagInput
              value={formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []}
              onChange={(tags) => handleInputChange("tags", Array.isArray(tags) ? tags.join(',') : tags)}
              placeholder="Add tags to categorize this task"
            />
            <p className="text-sm text-slate-500 mt-1">
              Tags help you organize and filter your tasks
            </p>
          </div>

          {/* Creation Info */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-medium text-slate-700 flex items-center">
              <ApperIcon name="Info" className="w-4 h-4 mr-2" />
              Task Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-medium">Created by:</span> Current User
              </div>
              <div>
                <span className="font-medium">Created on:</span> {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
<Button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default CreateTaskModal