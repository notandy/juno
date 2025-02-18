import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"

const inputstyles = `
	jn-w-4
	jn-h-4
	jn-opacity-0
	jn-z-50
`

const checkedstyles = `
	jn-inline-block
	jn-absolute
	jn-bg-theme-radio-checked
	jn-rounded-full
	jn-w-3
	jn-h-3
	jn-top-0.5
	jn-left-0.5
`

const mockradiostyles = `
	jn-w-4
	jn-h-4
	jn-rounded-full
	jn-bg-theme-radio
	jn-relative
`

const mockfocusradiostyles = `
	jn-outline-none
	jn-ring-2
	jn-ring-theme-focus
`

const mockdisabledradiostyles = `
	jn-opacity-50
	jn-cursor-not-allowed
`

const errorstyles = `
	jn-border
	jn-border-theme-error
`

const successstyles = `
	jn-border
	jn-border-theme-success
`


/** A controlled Radio component, label not included. */
export const Radio = ({
	name,
	id,
	value,
	checked,
	className,
	disabled,
	invalid,
	valid,
	onChange,
	onClick,
	...props
}) => {
	const [isChecked, setIsChecked] = useState(false)
	const [hasFocus, setHasFocus] = useState(false)
	const [isInvalid, setIsInvalid] = useState(false)
	const [isValid, setIsValid] = useState(false)
	
	useEffect( () => {
		setIsChecked(checked)
	}, [checked])
	
	useEffect(() => {
		setIsInvalid(invalid)
	}, [invalid])
	
	useEffect(() => {
		setIsValid(valid)
	}, [valid])
	
	const handleChange = (event) => {
		setIsChecked(!isChecked)
		onChange && onChange(event)
	}
	
	const handleFocus = () => {
		setHasFocus(true)
	}
	
	const handleBlur = () => {
		setHasFocus(false)
	}
	
	const handleClick = (event) => {
		onClick && onClick(event)
	}
	
	return (
		<div
			className={`juno-radio ${mockradiostyles} ${ hasFocus ? mockfocusradiostyles : "" } ${ disabled ? mockdisabledradiostyles : "" } ${ isInvalid ? errorstyles : "" } ${isValid ? successstyles : ""} ${className}`}
			{...props}
		>
			<input 
				type="radio"
				name={name || "unnamed radio"}
				value={value}
				id={id}
				checked={isChecked}
				className={`${inputstyles} ${isInvalid ? "juno-radio-invalid" : ""} ${ isValid ? "juno-radio-valid" : ""}`}
				disabled={disabled}
				onChange={handleChange}
				onClick={handleClick}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
			{ isChecked ? 
				<span className={`${checkedstyles}`}></span>
			:
				""
			}
		</div>
	)
}

Radio.propTypes = {
	/** Name attribute */
	name: PropTypes.string,
	/** Id of the checkbox */
	id: PropTypes.string,
	/** Pass a value the checkbox should represent.*/
	value: PropTypes.string,
	/**  Pass checked state  */
	checked: PropTypes.bool,
	/** Pass a className */
	className: PropTypes.string,
	/** Whether the checkbox is disabled */
	disabled: PropTypes.bool,
	/** Whether the Radio is invalid */
	invalid: PropTypes.bool,
	/** Whether the Radio is valid */
	valid: PropTypes.bool,
	/** Pass a change handler */
	onChange: PropTypes.func,
	/** Pass a click handler */
	onClick: PropTypes.func,
}

Radio.defaultProps = {
	checked: false,
	value: "",
	id: "",
	className: "",
	disabled: false,
	invalid: false,
	valid: false,
	onChange: undefined,
	onClick: undefined,
}
