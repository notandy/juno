import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Icon } from "../Icon/index.js";
import { knownIcons } from "../Icon/Icon.component.js"
import "./topNavigationItem.scss"

/**
A top level navigation item. Top be placed inside TopNavigation.
*/

export const TopNavigationItem = ({
  icon,
  label,
  ariaLabel,
  href,
  active,
  onClick,
  children,
  className,
  ...props
}) => {
  
  const icn = icon ? <Icon icon={icon} size="18" color="jn-text-theme-default" className={ label && label.length ? "jn-mr-1" : "" } /> : null
  
  const content = label || children
  
  const handleButtonClick = (event) => {
    onClick && onClick(event)
  }
  
  const anchor = (
    <a className={`juno-topnavigation-item ${ active ? "juno-topnavigation-item-active" : ""} ${className}`} 
      href={href} 
      aria-label={ariaLabel}
      {...props}
    >
      { icn }
      { content }
    </a>
  )
  
  const button = (
    <button 
      className={`juno-topnavigation-item ${ active ? "juno-topnavigation-item-active" : ""} ${className}`} 
      onClick={handleButtonClick}
      aria-label={ariaLabel}
      {...props}
    >
      { icn }
      { content }
    </button>
  )
  
  const plain = (
    <div className={`juno-topnavigation-item ${ active ? "juno-topnavigation-item-active" : ""} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      { icn }
      { label || children }
    </div>
  )
  
  return href ? anchor : onClick ? button : plain
}

TopNavigationItem.propTypes = {
  /** pass an icon name */
  icon: PropTypes.oneOf(knownIcons),
  /** The label of the item */
  label: PropTypes.string,
  /** Children of the item. Will overwrite label when passed */
  children: PropTypes.node,
  /** Pass a custom className */
  className: PropTypes.string,
  /** The aria label of the item */
  ariaLabel: PropTypes.string,
  /** The link the item should point to. Will render the item as an anchor if passed */
  href: PropTypes.string,
  /** Whether the item is the currently active item */
  active: PropTypes.bool,
  /** A handler to execute once the item is clicked. Will render the item as a button element if passed */
  onClick: PropTypes.func,
}

TopNavigationItem.defaultProps = {
  icon: null,
  label: "",
  children: null,
  className: "",
  ariaLabel: "",
  href: "",
  active: false,
  onClick: undefined,
}