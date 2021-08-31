import React, { useState } from "react"
import PropTypes from "prop-types"

const swtchStyles = (size) => {
	return (
		`
			rounded-full
			relative
			p-0
			leading-0
			focus:outline-none
			focus:ring-2
			focus:ring-focus
			disabled:opacity-50
			disabled:cursor-not-allowed
			${ size === 'small' ? 'w-8 h-4' : '' }
			${ size === 'large' ? 'w-12 h-6' : '' }
			${ size === 'default' ? 'w-10 h-5' : '' }
		`
	)
}

const swtchBodyStyles = (size) => {
	return (
		`	
			absolute
			top-0
			right-0
			bottom-0
			left-0
			${ size === 'small' ? 'w-8 h-4' : '' }
			${ size === 'large' ? 'w-12 h-6' : '' }
			${ size === 'default' ? 'w-10 h-5' : '' }
		`
	)	
}

const swtchTrackStyles = (size, checked) => {
	return (
		`
			border
			inline-block
			absolute
			top-0
			right-0
			bottom-0
			left-0
			rounded-full
			g-theme-default
			border-theme-switch-default
			hover:border-theme-switch-hover
			${ size === 'small' ? 'w-8 h-4' : '' }
			${ size === 'large' ? 'w-12 h-6' : '' }
			${ size === 'default' ? 'w-10 h-5' : '' }
		`
	)
	
}

const swtchHandleStyles = (size, checked) => {
	return (
		`
			inline-block
			absolute
			top-0
			rounded-full
			bg-white 
			border-theme-default
			${ size === 'small' ? 'w-4 h-4' : '' }
			${ size === 'large' ? 'w-6 h-6' : '' }
			${ size === 'default' ? 'w-5 h-5' : '' }
			${checked ? 'right-0 bg-theme-switch-handle-checked' : 'left-0'}
		`
	)
}

/** A Switch/Toggle component */
export const Switch = ({
	name,
	id,
	checked,
	onChange,
	size,
	disabled,
	className,
	...props
}) => {
	const [checkedState, toggleChecked] = useState(checked)
	const [disabledState, toggleDisabled] = useState(disabled)
	return (
		<button 
			type="button"
			role="switch"
			name={name}
			id={id}
			className={`switch ${swtchStyles(size)} ${className}`}
			checked={checkedState}
			aria-checked={checkedState}
			disabled={disabledState}
			onChange={onChange}
			onClick={ () => toggleChecked(!checkedState) }
			{...props}
		>
			<span className={`switch-body ${swtchBodyStyles(size)}`}>
				<span className={`switch-track ${swtchTrackStyles(size, checkedState)}`}></span>
				<span className={`switch-handle ${swtchHandleStyles(size, checkedState)}`}></span>
			</span>
		</button>
	)
}

Switch.propTypes = { 
	/** Name attribute */
	name: PropTypes.string,
	/** Id */
	id: PropTypes.string,
	/** Leave empty for default size */
	size: PropTypes.oneOf(["small", "default", "large"]),
	/**  Pass checked state for initial rendering. */
	checked: PropTypes.bool,
	/** Disabled switch */
	disabled: PropTypes.bool,
	/** Pass a className */
	className: PropTypes.string,
	/** Pass a handler */
	onChange: PropTypes.func,
}

Switch.defaultProps = {
	name: "unnamed switch",
	id: null,
	checked: false,
	disabled: null,
	size: "default",
	className: "",
	onChange: undefined,
}