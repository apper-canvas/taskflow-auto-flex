import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-slate-200 select-none">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full">
              <ApperIcon name="SearchX" className="w-12 h-12 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-slate-800">
            Page Not Found
          </h1>
          <p className="text-lg text-slate-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-slate-500">
            Let's get you back to managing your tasks.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <ApperIcon name="Home" className="w-4 h-4 mr-2" />
            Go to Dashboard
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Help */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? Try searching for your tasks or creating a new one.
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound