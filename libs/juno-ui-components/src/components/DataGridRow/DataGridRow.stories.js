import React from "react"
import { DataGridRow } from "./index.js"
import { DataGridCell } from "../DataGridCell/index.js"
import { Default as DataGridCellStory } from "../DataGridCell/DataGridCell.stories.js"
import { DataGrid } from "../DataGrid/index.js"

const columns = 5

export default {
  title: "Components/DataGrid/DataGridRow",
  component: DataGridRow,
  argTypes: {},
  decorators: [
    (story) => (
      <DataGrid columns={columns}>
        {story()}
      </DataGrid>
    ),
  ],
  parameters: {
    docs: {
      source: {
        excludeDecorators: false,
      },
    },
  }
}

const Template = ({ items, ...args }) => (
  <DataGridRow {...args}>
    {items.map((item, i) => (
      <DataGridCell {...item} key={`${i}`} />
    ))}
  </DataGridRow>
)

export const Default = Template.bind({})
Default.parameters = {
  docs: {
    description: {
      story: "Juno DataGridRow for use in DataGrid",
    },
  },
}
Default.args = {
  items: Array(columns).fill({ ...DataGridCellStory.args }),
}
