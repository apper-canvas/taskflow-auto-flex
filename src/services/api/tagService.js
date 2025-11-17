import tagsData from '@/services/mockData/tags.json'

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Local storage key
const STORAGE_KEY = 'taskflow_tags'

// Initialize localStorage with mock data if empty
const initializeStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tagsData))
    return tagsData
  }
  return JSON.parse(stored)
}

// Get tags from localStorage
const getTags = () => {
  const tags = localStorage.getItem(STORAGE_KEY)
  return tags ? JSON.parse(tags) : initializeStorage()
}

// Save tags to localStorage
const saveTags = (tags) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags))
}

export const tagService = {
  // Get all tags
  async getAll() {
    await delay(250)
    return [...getTags()]
  },

  // Get tag by ID
  async getById(id) {
    await delay(200)
    const tags = getTags()
    const tag = tags.find(t => t.Id === parseInt(id))
    if (!tag) {
      throw new Error(`Tag with ID ${id} not found`)
    }
    return { ...tag }
  },

  // Create new tag
  async create(tagData) {
    await delay(300)
    const tags = getTags()
    
    // Check if tag with same name already exists (case insensitive)
    const existingTag = tags.find(t => t.name.toLowerCase() === tagData.name.toLowerCase())
    if (existingTag) {
      return { ...existingTag }
    }
    
    // Find the highest existing Id and add 1
    const maxId = tags.length > 0 ? Math.max(...tags.map(t => t.Id)) : 0
    const newTag = {
      Id: maxId + 1,
      name: tagData.name,
      color: tagData.color || "#3b82f6"
    }
    
    tags.push(newTag)
    saveTags(tags)
    return { ...newTag }
  },

  // Update tag
  async update(id, updateData) {
    await delay(300)
    const tags = getTags()
    const tagIndex = tags.findIndex(t => t.Id === parseInt(id))
    
    if (tagIndex === -1) {
      throw new Error(`Tag with ID ${id} not found`)
    }

    tags[tagIndex] = {
      ...tags[tagIndex],
      ...updateData,
      Id: parseInt(id) // Ensure ID remains integer
    }
    
    saveTags(tags)
    return { ...tags[tagIndex] }
  },

  // Delete tag
  async delete(id) {
    await delay(250)
    const tags = getTags()
    const tagIndex = tags.findIndex(t => t.Id === parseInt(id))
    
    if (tagIndex === -1) {
      throw new Error(`Tag with ID ${id} not found`)
    }

    tags.splice(tagIndex, 1)
    saveTags(tags)
    return true
  }
}