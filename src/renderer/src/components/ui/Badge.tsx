import React from 'react'

interface BadgeProps {
  variant?: 'gold' | 'blue' | 'green' | 'red' | 'gray'
  children: React.ReactNode
}

function Badge({ variant = 'gold', children }: BadgeProps): React.JSX.Element {
  return <span className={`badge badge-${variant}`}>{children}</span>
}

export default Badge
