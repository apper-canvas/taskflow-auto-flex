import { getApperClient } from '@/services/apperClient'
import { toast } from 'react-toastify'

export const tagService = {
  // Get all tags
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.fetchRecords('Tag_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "color_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching tags:", error?.response?.data?.message || error);
      toast.error("Failed to fetch tags");
      return [];
    }
  },

  // Get tag by ID
  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.getRecordById('Tag_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}}, 
          {"field": {"Name": "color_c"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching tag ${id}:`, error?.response?.data?.message || error);
      toast.error("Failed to fetch tag");
      return null;
    }
  },

  // Create new tag
  async create(tagData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        records: [{
          Name: tagData.Name,
          Tags: tagData.Tags || "",
          color_c: tagData.color_c || "#3b82f6"
        }]
      };

      const response = await apperClient.createRecord('Tag_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tags:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Tag created successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error creating tag:", error?.response?.data?.message || error);
      toast.error("Failed to create tag");
      return null;
    }
  },

  // Update tag
  async update(id, updateData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const params = {
        records: [{
          Id: parseInt(id),
          ...(updateData.Name && { Name: updateData.Name }),
          ...(updateData.Tags !== undefined && { Tags: updateData.Tags }),
          ...(updateData.color_c && { color_c: updateData.color_c })
        }]
      };

      const response = await apperClient.updateRecord('Tag_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tags:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Tag updated successfully");
          return successful[0].data;
        }
      }

      return null;
    } catch (error) {
      console.error("Error updating tag:", error?.response?.data?.message || error);
      toast.error("Failed to update tag");
      return null;
    }
  },

  // Delete tag
  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        throw new Error('ApperClient not available');
      }

      const response = await apperClient.deleteRecord('Tag_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tags:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          toast.success("Tag deleted successfully");
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error("Error deleting tag:", error?.response?.data?.message || error);
      toast.error("Failed to delete tag");
      return false;
    }
  }
}