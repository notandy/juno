import React from "react"
import PropTypes from "prop-types"
import { Switch } from "../Switch/index.js"

const switchgroup = `
	flex
	flex-row
`

/** A checkbox input group containing a checkbox, associated label, and structural markup */
export const SwitchGroup =({
	value,
	name,
	label,
	id,
	helptext,
	onChange,
	...props
}) => {

	return (
		<div
			className={`${switchgroup}`}
			{...props}
		>
			<div>
				<Switch name={name} onChange={onChange} id={id} value={value || ""} />
			</div>
			<div>
				<label htmlFor={id}>{label}</label>
				{helptext ? <p>{helptext}</p> : ""}
			</div>
		</div>
	)
}

SwitchGroup.propTypes = {
	/** Optional initial value */
	value: PropTypes.string,
	/** Name attribute of the checkbox element */
	name: PropTypes.string,
	/** Label text */
	label: PropTypes.string,
	/** Id */
	id: PropTypes.string,
	/** Help text */
	helptext: PropTypes.string,
	/** Pass a handler to the checkbox element */
	onChange: PropTypes.func,
}

SwitchGroup.defaultProps = {
	value: null,
	name: null,
	label: null,
	id: null,
	helptext: null,
	onChange: undefined,
}

