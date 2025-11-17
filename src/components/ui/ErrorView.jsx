import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const ErrorView = ({ message, onRetry }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-8 max-w-md mx-auto">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full shadow-lg">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800">
            Something went wrong
          </h2>
          <p className="text-lg text-slate-600">
            {message || "We encountered an error while loading your tasks."}
          </p>
          <p className="text-slate-500">
            Don't worry, your data is safe. Please try again.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Reload Page
          </Button>
        </div>

        {/* Help */}
        <div className="pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            If the problem persists, try refreshing the page or check your internet connection.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ErrorView