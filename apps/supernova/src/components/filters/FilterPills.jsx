import React from "react"

import { Pill, Stack } from "juno-ui-components"
import { useActiveFilters, useFilterActions } from "../../hooks/useStore"

const FilterPills = () => {

  const activeFilters = useActiveFilters()
  const { removeActiveFilter } = useFilterActions()

  return (
    <Stack gap="2">
        { Object.entries(activeFilters).map(([key, values]) => {
          return (
            values.map((value) => 
              <Pill 
                pillKey={key}
                pillValue={value}
                closeable
                onClose={() => removeActiveFilter(key, value)}
                key={`${key}:${value}`}
              />
            )
          )
        })}
      </Stack>
  )
}

export default FilterPills