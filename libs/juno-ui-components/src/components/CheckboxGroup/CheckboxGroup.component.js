import React, { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { Label } from "../Label/index.js"
import { Icon } from "../Icon/index"

const checkboxgroupstyles = `
	jn-mb-4
	jn-last:mb-0
`

const checkboxgrouplabelstyles = `
	jn-inline-block
	jn-mb-1
`

const groupstyles = `
	jn-relative
	jn-rounded
	jn-border
	jn-py-1
`

const defaultgroupstyles = `
	jn-border-transparent
`

const validgroupstyles = `
	jn-border-theme-success
	jn-px-2
`

const invalidgroupstyles = `
	jn-border-theme-error
	jn-px-2
`

const errortextstyles = `
	jn-text-xs
	jn-text-theme-error
	jn-mb-2
`

const successtextstyles = `
	jn-text-xs
	jn-text-theme-success
	jn-mb-2
`

const iconstyles = `
	jn-absolute
	jn-right-2
	jn-top-1.5
`

/**
A component to semantically group Checkboxes together. All Checkboxes inside the CheckboxGroup will share the same 'name' attribute.
*/
export const CheckboxGroup = ({
  name,
  label,
  selected,
  required,
  disabled,
  valid,
  errortext,
  invalid,
  successtext,
  children,
  className,
  ...props
}) => {
  const [selectedOptions, setSelectedOptions] = useState([])
  const [isValid, setIsValid] = useState(false)
  const [isInvalid, setIsInvalid] = useState(false)

  const validated = useMemo(
    () => valid || (successtext && successtext.length ? true : false),
    [valid, successtext]
  )
  const invalidated = useMemo(
    () => invalid || (errortext && errortext.length ? true : false),
    [invalid, errortext]
  )

  useEffect(() => {
    setSelectedOptions(selected)
  }, [selected])

  useEffect(() => {
    setIsValid(validated)
  }, [validated])

  useEffect(() => {
    setIsInvalid(invalidated)
  }, [invalidated])

  const handleCheckboxChange = (event) => {
    const changedValue = event.target.value
    const exists = selectedOptions.includes(changedValue)
    if (exists) {
      // remove element if it was the previously selected element…
      setSelectedOptions(
        selectedOptions.filter((value) => {
          return value !== changedValue
        })
      )
    } else {
      // …otherwise add element
      setSelectedOptions((selectedOptions) => [
        ...selectedOptions,
        changedValue,
      ])
    }
  }

  const namedChildren = () => {
    return React.Children.map(children, (child) => {
      const isSelected = selectedOptions.includes(child.props.value)
      return React.cloneElement(child, {
        name: name,
        className: className,
        disabled: disabled,
        checked: isSelected,
        onChange: handleCheckboxChange,
      })
    })
  }

  return (
    <div
      role="group"
      className={`juno-checkbox-group ${
        isValid ? "juno-checkbox-group-valid" : ""
      } ${
        isInvalid ? "juno-checkbox-group-invalid" : ""
      } ${checkboxgroupstyles} ${className}`}
      {...props}
    >
      {label ? (
        <Label
          text={label}
          htmlFor={name}
          required={required}
          className={`${checkboxgrouplabelstyles}`}
        />
      ) : (
        ""
      )}
      {errortext && errortext.length ? (
        <p className={`${errortextstyles}`}>{errortext}</p>
      ) : null}
      {successtext && successtext.length ? (
        <p className={`${successtextstyles}`}>{successtext}</p>
      ) : null}
      <div
        className={`juno-checkbox-group-options ${groupstyles} ${
          isValid ? validgroupstyles : ""
        } ${isInvalid ? invalidgroupstyles : ""} ${
          isValid || isInvalid ? "" : defaultgroupstyles
        }`}
      >
        {isInvalid ? (
          <Icon
            icon="dangerous"
            color="jn-text-theme-error"
            className={`${iconstyles}`}
          />
        ) : null}
        {isValid ? (
          <Icon
            icon="checkCircle"
            color="jn-text-theme-success"
            className={`${iconstyles}`}
          />
        ) : null}
        {namedChildren()}
      </div>
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
  /** Whether the CheckboxGroup is invalid */
  invalid: PropTypes.bool,
  /** Text to display in case validation failed. Will sett the whole group to invalid when passed. */
  errortext: PropTypes.string,
  /** Whether the CheckboxGroup is valid */
  valid: PropTypes.bool,
  /** Text to display in case validation is successful. When passed, will set the whole group to valid. */
  successtext: PropTypes.string,
  /** Custom class to be passed to the individual checkboxes of the group */
  className: PropTypes.string,
  /** Child checkbox components */
  children: PropTypes.node,
}

CheckboxGroup.defaultProps = {
  name: "",
  className: "",
  label: "",
  required: false,
  selected: [],
  disabled: false,
  invalid: false,
  errortext: "",
  valid: false,
  successtext: "",
  children: null,
}
