import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import { cn } from '@/utils/cn'

const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  size = "md",
  showCloseButton = true,
  className = ""
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  }

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            {/* Backdrop */}
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={cn(
                "relative w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-200/50 text-left",
                sizes[size],
                className
              )}
            >
              {/* Close Button */}
              {showCloseButton && (
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2"
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Title */}
              {title && (
                <div className="px-6 py-4 border-b border-slate-200/70">
                  <h3 className="text-xl font-semibold text-slate-900">
                    {title}
                  </h3>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal