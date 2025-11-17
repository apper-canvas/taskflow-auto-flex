import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Modal from '@/components/organisms/Modal'

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "primary",
  icon = "AlertTriangle"
}) => {
  const iconColors = {
    primary: "text-primary-600 bg-primary-100",
    danger: "text-red-600 bg-red-100",
    warning: "text-amber-600 bg-amber-100",
    success: "text-emerald-600 bg-emerald-100"
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="sm"
      showCloseButton={false}
    >
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className={`p-3 rounded-full ${iconColors[confirmVariant]}`}>
            <ApperIcon name={icon} className="w-8 h-8" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-900">
            {title}
          </h3>
          <p className="text-slate-600">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            className="px-6"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ConfirmDialog