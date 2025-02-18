import React from "react"
import { render, act } from "@testing-library/react"
// support shadow dom queries
// https://reactjsexample.com/an-extension-of-dom-testing-library-to-provide-hooks-into-the-shadow-dom/
import { screen } from "shadow-dom-testing-library"
import ShellLayout from "./ShellLayout"
jest.mock("communicator")

test("renders app", async () => {
  await act(() => render(<ShellLayout />))

  let loginTitle = await screen.queryAllByShadowText(/Green/i)
  expect(loginTitle.length > 0).toBe(true)
})
