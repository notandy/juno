import React, { useState, useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { Label } from "../Label/index.js"

const checkboxgroupstyles = `
	mb-5
`

export const CheckboxGroup = ({
	name,
	label,
	selected,
	required,
	disabled,
	children,
	className,
	...props
}) => {
	
	const [selectedOptions, setSelectedOptions] = useState([])
	
	useEffect( () => {
		setSelectedOptions(selected)
	}, [selected])
	
	const handleCheckboxChange = (event) => {
		const changedValue = event.target.value
		const index = selectedOptions.indexOf(changedValue)
		let newSelectedOptions = selectedOptions
		if ( index > -1) {
			// remove element if already in selectedOptions:
			newSelectedOptions.splice(index, 1)
		} else {
			// otherwise add element:
			newSelectedOptions.push(changedValue)
		}
		setSelectedOptions(newSelectedOptions)
	}
	
	const namedChildren = () => {
		return React.Children.map(children, (child) => {
			const isSelected = selectedOptions.includes(child.props.value)
			return React.cloneElement(child, {
				name: name,
				className: className,
				disabled: disabled,
				checked: isSelected,
				onChange: handleCheckboxChange
			});
		});
	 };
	
	return (
		<div role="group" className={`checkbox-group ${checkboxgroupstyles}`} {...props} >
			{ label ? <Label text={label} htmlFor={name} required={required} /> : "" }
			{ namedChildren() }
		</div>
	)
}


CheckboxGroup.propTypes = {
	/** Name attribute. Checkboxes within the group will have this name attribute */
	name: PropTypes.string,
	/** Label for the groupd as a whole */
	label: PropTypes.string,
	/** Array of values of individual selected options in the group */
	selected: PropTypes.array,
	/** Whether a selection in the group is required */
	required: PropTypes.bool,
	/** Disable the whole group */
	disabled: PropTypes.bool,
	/** Custom class to be passed to the individual checkboxes of the group */
	className: PropTypes.string,
	/** Child checkbox components */
	children: PropTypes.node,
}


CheckboxGroup.defaultProps = {
	name: null,
	className: "",
	label: null,
	required: null,
	selected: [],
	disabled: null,
	children: null,
}