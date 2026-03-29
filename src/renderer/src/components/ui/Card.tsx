import React from 'react'

interface CardProps {
  id?: string
  title?: React.ReactNode
  titleIcon?: string
  action?: React.ReactNode
  children: React.ReactNode
}

function Card({ id, title, titleIcon, action, children }: CardProps): React.JSX.Element {
  return (
    <div className="card" id={id}>
      {title && (
        <div className="card-header">
          <div className="card-title">
            {titleIcon && <div className="card-title-icon">{titleIcon}</div>}
            {title}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card
