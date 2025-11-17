import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import Button from "@/components/atoms/Button";
import { useAuth } from "@/layouts/Root";

function Header() {
  const { user } = useSelector((state) => state.user)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false)

  const handleTaskCreated = () => {
    // Refresh the current page if it's the dashboard
    if (location.pathname === '/') {
      window.location.reload()
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      active: location.pathname === '/'
    },
    {
      label: 'Staff',
      path: '/staff',
      icon: 'Users',
      active: location.pathname === '/staff'
    }
  ]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="CheckSquare" size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900">TaskFlow</span>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <ApperIcon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Create Task Button */}
            <Button 
              onClick={() => setCreateTaskModalOpen(true)}
              size="sm"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Task
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs text-slate-600">
                  {user?.emailAddress}
                </div>
              </div>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-slate-600" />
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-red-600"
              >
                <ApperIcon name="LogOut" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSuccess={handleTaskCreated}
      />
    </header>
  )
}

export default Header