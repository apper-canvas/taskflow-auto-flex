import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"

const FormField = ({ 
  label, 
  error, 
  required, 
  children, 
  className = "" 
}) => {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {children || <Input error={error} />}
      {error && (
        <p className="text-sm text-red-600 mt-1 flex items-center">
          <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  )
}

export default FormField