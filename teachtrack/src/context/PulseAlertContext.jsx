import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import './PulseAlertContext.css'

/**
 * Global alert + confirm modal. Mirrors PulseBox's usePulseAlert.
 *
 * showAlert({ title, message, variant, buttons: [{ text, style, onPress }] })
 * showSuccess(title, message?)
 * showError(title, message?)
 * showWarning(title, message?)
 */

const PulseAlertContext = createContext(null)

const DEFAULT_BUTTONS = [{ text: 'OK', style: 'default' }]

export function PulseAlertProvider({ children }) {
  const [config, setConfig] = useState(null)

  const close = useCallback(() => setConfig(null), [])

  const showAlert = useCallback((cfg) => {
    setConfig({
      title: cfg.title ?? '',
      message: cfg.message ?? '',
      variant: cfg.variant ?? 'default',
      buttons: cfg.buttons?.length ? cfg.buttons : DEFAULT_BUTTONS,
    })
  }, [])

  const showSuccess = useCallback(
    (title, message) =>
      showAlert({ title, message, variant: 'success', buttons: DEFAULT_BUTTONS }),
    [showAlert],
  )

  const showError = useCallback(
    (title, message) =>
      showAlert({ title, message, variant: 'error', buttons: DEFAULT_BUTTONS }),
    [showAlert],
  )

  const showWarning = useCallback(
    (title, message) =>
      showAlert({ title, message, variant: 'warning', buttons: DEFAULT_BUTTONS }),
    [showAlert],
  )

  const value = useMemo(
    () => ({ showAlert, showSuccess, showError, showWarning, close }),
    [showAlert, showSuccess, showError, showWarning, close],
  )

  return (
    <PulseAlertContext.Provider value={value}>
      {children}
      {config && (
        <div
          className="tt-alert-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={config.title}
          onClick={close}
        >
          <div
            className={`tt-alert tt-alert-${config.variant}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`tt-alert-icon tt-alert-icon-${config.variant}`}>
              {iconFor(config.variant)}
            </div>
            {config.title ? (
              <h2 className="tt-alert-title">{config.title}</h2>
            ) : null}
            {config.message ? (
              <p className="tt-alert-message">{config.message}</p>
            ) : null}
            <div className="tt-alert-actions">
              {config.buttons.map((btn, i) => (
                <button
                  key={`${btn.text}-${i}`}
                  type="button"
                  className={`tt-alert-btn tt-alert-btn-${btn.style ?? 'default'}`}
                  onClick={() => {
                    close()
                    btn.onPress?.()
                  }}
                >
                  {btn.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </PulseAlertContext.Provider>
  )
}

function iconFor(variant) {
  if (variant === 'success') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 12.5L10 17.5L19 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (variant === 'error') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  }
  if (variant === 'warning') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M12 4L22 20H2L12 4Z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M12 10V14M12 17V17.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
      <path d="M12 7V13M12 16.5V17" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

export function usePulseAlert() {
  const ctx = useContext(PulseAlertContext)
  if (!ctx) throw new Error('usePulseAlert must be used within PulseAlertProvider')
  return ctx
}
