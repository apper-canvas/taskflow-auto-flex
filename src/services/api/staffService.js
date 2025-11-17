import { getApperClient } from '@/services/apperClient'

class StaffService {
  constructor() {
    this.tableName = 'staff_c'
  }

  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ],
        orderBy: [{"fieldName": "ModifiedOn", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }

      const response = await apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data || []
    } catch (error) {
      console.error("Error fetching staff:", error?.response?.data?.message || error)
      return []
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "Owner"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "CreatedBy"}},
          {"field": {"Name": "ModifiedOn"}},
          {"field": {"Name": "ModifiedBy"}}
        ]
      }

      const response = await apperClient.getRecordById(this.tableName, id, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      return response.data
    } catch (error) {
      console.error(`Error fetching staff ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(staffData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [
          {
            // Only include Updateable fields from staff_c table
            Name: staffData.Name || "",
            Tags: staffData.Tags || ""
          }
        ]
      }

      const response = await apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} staff records:`, failed)
        }
        
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error creating staff:", error?.response?.data?.message || error)
      return null
    }
  }

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      const params = {
        records: [
          {
            Id: id,
            // Only include Updateable fields with actual values
            ...(updateData.Name !== undefined && { Name: updateData.Name }),
            ...(updateData.Tags !== undefined && { Tags: updateData.Tags })
          }
        ]
      }

      const response = await apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return null
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} staff records:`, failed)
        }
        
        return successful.length > 0 ? successful[0].data : null
      }

      return null
    } catch (error) {
      console.error("Error updating staff:", error?.response?.data?.message || error)
      return null
    }
  }

  async delete(recordIds) {
    try {
      const apperClient = getApperClient()
      const ids = Array.isArray(recordIds) ? recordIds : [recordIds]
      const params = { RecordIds: ids }

      const response = await apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return false
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} staff records:`, failed)
        }
        
        return successful.length === ids.length
      }

      return false
    } catch (error) {
      console.error("Error deleting staff:", error?.response?.data?.message || error)
      return false
    }
  }
}

export default new StaffService()