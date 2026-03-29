import React from 'react'

interface FormSelectProps {
  label?: string
  id: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  required?: boolean
}

function FormSelect({
  label,
  id,
  value,
  onChange,
  options,
  required
}: FormSelectProps): React.JSX.Element {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label} {required && <span>*</span>}
        </label>
      )}
      <select
        className="form-select"
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect
