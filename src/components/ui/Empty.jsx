import { useState } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import CreateTaskModal from '@/components/organisms/CreateTaskModal'

const Empty = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center space-y-8 max-w-lg mx-auto">
          {/* Illustration */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full shadow-xl">
                <ApperIcon name="CheckSquare" className="w-16 h-16 text-primary-500" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full shadow-lg">
                <ApperIcon name="Plus" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Ready to Get Organized?
            </h2>
            <p className="text-lg text-slate-600">
              You don't have any tasks yet. Create your first task to start managing your workflow like a pro.
            </p>
            <p className="text-slate-500">
              With TaskFlow, you can track ownership, modifications, and organize with tags.
            </p>
          </div>

          {/* Primary Action */}
          <div className="pt-4">
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.05] transition-all duration-200 px-8 py-4"
            >
              <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
              Create Your First Task
            </Button>
          </div>

          {/* Features */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-200">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full">
                  <ApperIcon name="Users" className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-800">Track Ownership</h3>
              <p className="text-sm text-slate-500">Know who owns and modified each task</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full">
                  <ApperIcon name="Tags" className="w-6 h-6 text-amber-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-800">Organize with Tags</h3>
              <p className="text-sm text-slate-500">Categorize tasks with colored tags</p>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full">
                  <ApperIcon name="Clock" className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-slate-800">Full Audit Trail</h3>
              <p className="text-sm text-slate-500">Complete modification history</p>
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}

export default Empty