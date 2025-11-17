import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import Button from "@/components/atoms/Button";
const Header = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { user, isAuthenticated } = useSelector(state => state.user);
  const { logout } = useAuth();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <ApperIcon name="CheckSquare" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-slate-500 font-medium">Professional Task Management</p>
              </div>
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block">
                <SearchBar />
              </div>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Create Task
              </Button>
              
              {/* User Actions */}
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-slate-600 hidden md:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={logout}
                    className="text-slate-600 hover:text-slate-800"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <CreateTaskModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}

export default Header