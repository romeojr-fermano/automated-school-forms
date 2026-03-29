import React from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md'
  onClick?: () => void
  children: React.ReactNode
  style?: React.CSSProperties
}

function Button({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  style
}: ButtonProps): React.JSX.Element {
  return (
    <button
      className={`btn btn-${variant} ${size === 'sm' ? 'btn-sm' : ''}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button
