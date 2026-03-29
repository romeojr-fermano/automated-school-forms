import React from 'react'

interface FormInputProps {
  label?: string
  id: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  required?: boolean
}

function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required
}: FormInputProps): React.JSX.Element {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span>*</span>}
        </label>
      )}
      <input
        className="form-input"
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default FormInput
