import React, { useCallback, useEffect } from "react"
import { useParams } from "react-router-dom"
import { getService } from "../queries"
import useStore from "../store"
import { useStore as useMessageStore } from "../messageStore"
import { useLocation } from "react-router-dom"
import {
  Icon,
  DataList,
  DataListRow,
  DataListCell,
  Stack,
  Spinner,
} from "juno-ui-components"
import ComponentsList from "./ComponentsList"

const Header = `
font-bold
`

const ServiceDetail = () => {
  let { serviceId } = useParams()
  const location = useLocation()
  const endpoint = useStore(useCallback((state) => state.endpoint))
  const setMessage = useMessageStore((state) => state.setMessage)
  const placeholderData = location.state?.placeholderData
  const { isLoading, isError, isFetching, data, error } = getService(
    endpoint,
    serviceId,
    placeholderData
  )

  // dispatch error with useEffect because error variable will first set once all retries did not succeed
  useEffect(() => {
    if (error) {
      setMessage({
        variant: "error",
        text: parseError(error),
      })
    }
  }, [error])

  console.log("service detail placeholderData: ", placeholderData)
  console.log("service detail DATA: ", data)
  console.log("isFetching: ", isFetching)

  const components = React.useMemo(() => {
    if (!data?.Components) return []
    return data.Components
  }, [data])

  return (
    <>
      {isLoading && !data ? (
        <Stack alignment="center">
          <Spinner variant="primary" />
          Loading details...
        </Stack>
      ) : (
        <>
          {!isError && (
            <>
              {data ? (
                <>
                  <DataList>
                    <DataListRow className="relative">
                      <DataListCell>
                        <Icon className="mr-2" icon="autoAwesomeMosaic" />{" "}
                        {data.Name}
                      </DataListCell>
                    </DataListRow>
                  </DataList>
                  <p className={Header}>Vulnerabilities</p>
                  <p className={Header}>Components</p>
                  {components.length > 0 ? (
                    <div className="mt-4">
                      <ComponentsList components={components} />
                    </div>
                  ) : (
                    <Stack
                      alignment="center"
                      distribution="center"
                      direction="vertical"
                      className="h-full"
                    >
                      <p>There is no components yet.</p>
                    </Stack>
                  )}
                </>
              ) : (
                <Stack
                  alignment="center"
                  distribution="center"
                  direction="vertical"
                  className="h-full"
                >
                  <p>{`No details found for service id ${serviceId}`}</p>
                </Stack>
              )}
            </>
          )}
        </>
      )}
    </>
  )
}

export default ServiceDetail
