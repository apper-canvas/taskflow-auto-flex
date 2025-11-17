import React, { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { taskService } from "@/services/api/taskService";
import { tagService } from "@/services/api/tagService";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import TagInput from "@/components/molecules/TagInput";
import ConfirmDialog from "@/components/organisms/ConfirmDialog";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";

const TaskTable = ({ 
  tasks, 
  onTaskUpdate, 
  onTaskDelete, 
  onSort, 
  sortConfig,
  onSearch,
  searchQuery 
}) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [deleteTask, setDeleteTask] = useState(null)
  const [saving, setSaving] = useState(false)
  const [allTags, setAllTags] = useState([])

  const handleEditStart = async (task) => {
setEditingTask(task.Id)
    setEditForm({
      Name: task.Name,
Owner: task.Owner?.Name || '',
      Tags: task.Tags || '',
      CreatedBy: task.CreatedBy?.Name || '',
      ModifiedBy: task.ModifiedBy?.Name || ''
    })

    // Load tags for tag input
    try {
      const tags = await tagService.getAll()
      setAllTags(tags)
    } catch (error) {
      console.error("Failed to load tags:", error)
    }
  }

  const handleEditCancel = () => {
    setEditingTask(null)
    setEditForm({})
  }

const handleEditSave = async (taskId) => {
    if (!editForm.Name?.trim()) {
      toast.error("Task name is required")
      return
    }

    try {
      setSaving(true)
      const updatedTask = await taskService.update(taskId, {
        Name: editForm.Name.trim(),
        Tags: editForm.Tags
      })

      onTaskUpdate(updatedTask)
      setEditingTask(null)
      setEditForm({})
      toast.success("Task updated successfully")
    } catch (error) {
      toast.error("Failed to update task")
      console.error("Error updating task:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTask) return

    try {
      await taskService.delete(deleteTask.Id)
      onTaskDelete(deleteTask.Id)
      toast.success("Task deleted successfully")
      setDeleteTask(null)
    } catch (error) {
      toast.error("Failed to delete task")
      console.error("Error deleting task:", error)
    }
  }

  const handleKeyDown = (e, taskId) => {
    if (e.key === 'Enter') {
      handleEditSave(taskId)
    } else if (e.key === 'Escape') {
      handleEditCancel()
    }
  }

  const getTagColor = (tagName) => {
const tag = allTags.find(t => t.Name === tagName)
    return tag?.color || "#3b82f6"
  }

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <ApperIcon name="ArrowUpDown" className="w-4 h-4 opacity-40" />
    }
    return sortConfig.direction === "asc" 
      ? <ApperIcon name="ArrowUp" className="w-4 h-4 text-primary-600" />
      : <ApperIcon name="ArrowDown" className="w-4 h-4 text-primary-600" />
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full">
              <ApperIcon name="Search" className="w-8 h-8 text-slate-400" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No tasks found</h3>
            <p className="text-slate-600">
              {searchQuery ? `No tasks match "${searchQuery}"` : "Try adjusting your search or filters"}
            </p>
          </div>
          {searchQuery && (
            <Button
              variant="outline"
              onClick={() => onSearch("")}
              size="sm"
            >
              Clear search
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 overflow-hidden">
        {/* Mobile Search */}
        <div className="sm:hidden p-4 border-b border-slate-200/70">
          <SearchBar 
            onSearch={onSearch}
            defaultValue={searchQuery}
            placeholder="Search tasks..."
          />
        </div>

        {/* Table Header */}
<div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200/70">
          <div className="grid grid-cols-8 gap-4 items-center">
            <button
onClick={() => onSort("Name")}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span>Task Name</span>
              {getSortIcon("name")}
            </button>

<button
              onClick={() => onSort("Owner")}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span>Owner</span>
              {getSortIcon("Owner")}
            </button>

<div className="text-sm font-semibold text-slate-700">Tags</div>

            <button
onClick={() => onSort("CreatedBy")}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span>Created By</span>
              {getSortIcon("CreatedBy")}
            </button>

<button
              onClick={() => onSort("CreatedOn")}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span>Created</span>
              {getSortIcon("CreatedOn")}
            </button>
<button
              onClick={() => onSort("ModifiedOn")}
              className="flex items-center space-x-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors group"
            >
              <span>Modified</span>
              {getSortIcon("ModifiedOn")}
            </button>

            <div className="text-sm font-semibold text-slate-700 text-right">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-slate-100">
          {tasks.map((task, index) => (
            <div 
              key={task.Id}
              className={cn(
                "px-6 py-4 table-row-hover transition-all duration-150",
                editingTask === task.Id 
                  ? "bg-blue-50/80 ring-2 ring-blue-200/50" 
                  : "hover:bg-slate-50/80 hover:shadow-sm"
              )}
            >
<div className="grid grid-cols-8 gap-4 items-center">
                {/* Task Name */}
<div className="min-w-0">
                  {editingTask === task.Id ? (
                    <Input
                      value={editForm.Name || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, Name: e.target.value }))}
                      onKeyDown={(e) => handleKeyDown(e, task.Id)}
                      className="text-sm font-medium inline-edit-field"
                      placeholder="Task name"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="text-sm font-medium text-slate-900 truncate cursor-pointer hover:text-primary-600 transition-colors"
                      onClick={() => handleEditStart(task)}
                      title={task.Name}
                    >
                      {task.Name}
                    </div>
                  )}
                </div>

{/* Owner */}
                <div className="min-w-0">
                  {editingTask === task.Id ? (
                    <Input
                      value={editForm.Owner || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, Owner: e.target.value }))}
                      onKeyDown={(e) => handleKeyDown(e, task.Id)}
                      className="text-sm inline-edit-field"
                      placeholder="Owner name"
                    />
                  ) : (
                    <div 
                      className="text-sm text-slate-600 truncate cursor-pointer hover:text-slate-800 transition-colors"
                      onClick={() => handleEditStart(task)}
                      title={task.Owner?.Name || 'Unassigned'}
                    >
                      {task.Owner?.Name || 'Unassigned'}
                    </div>
                  )}
                </div>

                {/* Tags */}
<div className="min-w-0">
                  {editingTask === task.Id ? (
                    <TagInput
value={editForm.Tags || ''}
                      onChange={(tags) => setEditForm(prev => ({ ...prev, Tags: tags }))}
                      placeholder="Add tags..."
                      className="text-sm"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1" onClick={() => handleEditStart(task)}>
                      {task.Tags && task.Tags.trim() !== "" ? (
                        task.Tags.split(',').slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={`${task.Id}-${tag.trim()}-${tagIndex}`}
                            variant="custom"
                            color={getTagColor(tag.trim())}
                            className="text-xs"
                          >
                            {tag.trim()}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">
                          Add tags...
                        </span>
                      )}
                      {task.Tags && task.Tags.split(',').length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{task.Tags.split(',').length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

{/* Created By */}
                <div className="text-sm text-slate-600 truncate" title={task.CreatedBy?.Name || 'Unknown'}>
                  {task.CreatedBy?.Name || 'Unknown'}
                </div>

                {/* Created Date */}
                <div className="text-sm text-slate-500" title={new Date(task.CreatedOn).toLocaleString()}>
                  {format(new Date(task.CreatedOn), 'MMM d, yyyy')}
                </div>

                {/* Modified Date */}
                <div className="text-sm text-slate-500" title={new Date(task.ModifiedOn).toLocaleString()}>
                  {format(new Date(task.ModifiedOn), 'MMM d, yyyy')}
                </div>
                {/* Actions */}
                <div className="flex items-center justify-end space-x-2">
                  {editingTask === task.Id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleEditSave(task.Id)}
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        {saving ? (
                          <ApperIcon name="Loader2" className="w-3 h-3 animate-spin" />
                        ) : (
                          <ApperIcon name="Check" className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleEditCancel}
                        disabled={saving}
                        className="text-slate-500 hover:text-slate-700"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditStart(task)}
                        className="text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                      >
                        <ApperIcon name="Edit2" className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteTask(task)}
                        className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-3 border-t border-slate-200/70">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div>
              Showing {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </div>
            <div className="text-xs text-slate-500">
              Click any field to edit • Use Enter to save • Esc to cancel
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
message={`Are you sure you want to delete "${deleteTask?.Name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmVariant="danger"
      />
    </>
  )
}

export default TaskTable