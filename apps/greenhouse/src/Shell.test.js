import React from "react"
import { render, act } from "@testing-library/react"
// support shadow dom queries
// https://reactjsexample.com/an-extension-of-dom-testing-library-to-provide-hooks-into-the-shadow-dom/
import { screen } from "shadow-dom-testing-library"
import Shell from "./Shell"
import Auth from "./components/Auth"

jest.mock("communicator")
jest.mock("./components/Auth")

test("renders app", async () => {
  await act(() => render(<Shell />))

  expect(Auth).toHaveBeenCalledTimes(1)
})
