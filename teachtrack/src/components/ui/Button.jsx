import './Button.css'

export default function Button({
  as: Component = 'button',
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) {
  return (
    <Component
      className={`tt-btn tt-btn-${variant} tt-btn-${size} ${fullWidth ? 'tt-btn-full' : ''} ${className}`}
      {...props}
    >
      <span className="tt-btnText">{children}</span>
    </Component>
  )
}

