import React from "react"
import PropTypes from "prop-types"

const panelFooterClasses = `
  jn-border-t
  jn-border-t-theme-panel
  jn-px-8
  jn-py-4
  jn-flex
  jn-items-center
  jn-justify-end
  jn-gap-3
  jn-w-full
`

/**
 * The panel footer component. You can drop buttons in here and they will automatically be aligned correctly to the right.
 */
export const PanelFooter = ({ className, children, ...props }) => {
  return (
    <div
      className={`juno-panel-footer ${panelFooterClasses}  ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

PanelFooter.propTypes = {
  /** Add custom class name */
  className: PropTypes.string,
}

PanelFooter.defaultProps = {
  className: "",
}
