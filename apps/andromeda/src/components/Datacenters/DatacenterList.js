import React, {useState} from "react"

import {Box, Button, DataGrid, DataGridHeadCell, DataGridRow, Message, Spinner, Stack,} from "juno-ui-components"
import DatacenterListItem from "./DatacenterListItem"
import {authStore, useStore} from "../../store"
import {currentState, push} from "url-state-provider"
import {fetchAll, nextPageParam} from "../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';
import {Error, Loading} from "../Components";

const DatacenterList = () => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const [error, setError] = useState()
    const {
        data,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ["datacenters", endpoint],
        fetchAll,
        {
            getNextPageParam: nextPageParam,
            meta: auth?.token,
            onError: setError
        }
    )

    const handleNewDatacenterClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: "NewDatacentersItem"})
    }

    return (
        <>
            {/* Error Bar */}
            <Error error={error} />

            {/* Loading indicator for page content */}
            <Loading isLoading={isLoading} />

            <Stack
                distribution="between"
                direction="horizontal"
                alignment="center"
                className="jn-px-6 jn-py-3 mt-6 jn-bg-theme-background-lvl-1">
                <div className="jn-text-lg jn-text-theme-high">
                    <strong>Datacenters</strong>
                </div>
                <Button
                    variant="primary"
                    icon="addCircle"
                    onClick={handleNewDatacenterClick}
                    label="Add a Datacenter"
                />
            </Stack>
            {isSuccess ? (
                <DataGrid columns={9}>
                    <DataGridRow>
                        <DataGridHeadCell>ID/Name</DataGridHeadCell>
                        <DataGridHeadCell>Continent</DataGridHeadCell>
                        <DataGridHeadCell>Country</DataGridHeadCell>
                        <DataGridHeadCell>State/Province</DataGridHeadCell>
                        <DataGridHeadCell>City</DataGridHeadCell>
                        <DataGridHeadCell>Location</DataGridHeadCell>
                        <DataGridHeadCell>Created</DataGridHeadCell>
                        <DataGridHeadCell>Updated</DataGridHeadCell>
                        <DataGridHeadCell>Options</DataGridHeadCell>
                    </DataGridRow>

                    {/* Render items: */}
                    {data.pages.map((group, i) =>
                        group.datacenters.map((datacenter, index) => (
                            <DatacenterListItem key={index} datacenter={datacenter} setError={setError}/>)
                        )
                    )}
                </DataGrid>
            ) : (
                <div>There are no datacenters to display.</div>
            )
            }
            <Box>
                <Button
                    variant="subdued"
                    size="small"
                    icon="expandMore"
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                    className="whitespace-nowrap"
                >
                    {isFetching ? <Spinner variant="primary"/> : null}
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                </Button>
            </Box>
        </>
    )
}

export default DatacenterList
