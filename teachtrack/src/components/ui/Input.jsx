import './Input.css'

export default function Input({ label, className = '', ...props }) {
  return (
    <label className={`tt-inputWrap ${className}`}>
      {label ? <div className="tt-inputLabel">{label}</div> : null}
      <input className="tt-input" {...props} />
    </label>
  )
}

