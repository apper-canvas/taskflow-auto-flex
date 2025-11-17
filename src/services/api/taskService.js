import tasksData from '@/services/mockData/tasks.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Local storage key
const STORAGE_KEY = 'taskflow_tasks'

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksData))
    return tasksData
  }
  return JSON.parse(stored)
}

// Get tasks from localStorage
const getTasks = () => {
  const tasks = localStorage.getItem(STORAGE_KEY)
  return tasks ? JSON.parse(tasks) : initializeStorage()
}

// Save tasks to localStorage
const saveTasks = (tasks) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export const taskService = {
  // Get all tasks
  async getAll() {
    await delay(300)
    return [...getTasks()]
  },

  // Get task by ID
  async getById(id) {
    await delay(200)
    const tasks = getTasks()
    const task = tasks.find(t => t.Id === parseInt(id))
    if (!task) {
      throw new Error(`Task with ID ${id} not found`)
    }
    return { ...task }
  },

  // Create new task
  async create(taskData) {
    await delay(400)
    const tasks = getTasks()
    
    // Find the highest existing Id and add 1
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0
    const newTask = {
      Id: maxId + 1,
      name: taskData.name,
      createdOn: taskData.createdOn || new Date().toISOString(),
      createdBy: taskData.createdBy || "Current User",
      modifiedOn: taskData.modifiedOn || new Date().toISOString(),
      modifiedBy: taskData.modifiedBy || "Current User",
      owner: taskData.owner,
      tags: taskData.tags || [],
      status: taskData.status || "active"
    }
    
    tasks.push(newTask)
    saveTasks(tasks)
    return { ...newTask }
  },

  // Update task
  async update(id, updateData) {
    await delay(350)
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`)
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      ...updateData,
      Id: parseInt(id), // Ensure ID remains integer
      modifiedOn: new Date().toISOString(),
      modifiedBy: updateData.modifiedBy || "Current User"
    }
    
    saveTasks(tasks)
    return { ...tasks[taskIndex] }
  },

  // Delete task
  async delete(id) {
    await delay(300)
    const tasks = getTasks()
    const taskIndex = tasks.findIndex(t => t.Id === parseInt(id))
    
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${id} not found`)
    }

    tasks.splice(taskIndex, 1)
    saveTasks(tasks)
    return true
  }
}