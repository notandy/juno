import React from "react"
import {
    Box,
    Button,
    DataGrid,
    DataGridHeadCell,
    DataGridRow,
    Message,
    Spinner,
    Stack,
} from "juno-ui-components"
import MonitorListItem from "./MonitorListItem"
import useStore from "../../../store"
import { currentState, push } from "url-state-provider"
import {fetchAll, nextPageParam} from "../../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';

const MonitorList = ({setSelectedPool}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const {
        data,
        error,
        status,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(
        [`monitors`, endpoint],
        fetchAll,
        {getNextPageParam: nextPageParam}
    )
    const handleNewMonitorClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: "NewMonitorsItem"})
    }

    const handleCloseClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, pool: ""})
        setSelectedPool("")
    }

    return (
        <Stack direction="vertical" className="basis-1 md:basis-1/2">
            <Stack
                distribution="between"
                direction="horizontal"
                alignment="center"
                className="jn-px-6 jn-py-3 mt-6 jn-bg-theme-background-lvl-1">
                <div className="jn-text-lg jn-text-theme-high">
                    <strong>Associated Monitors</strong>
                </div>
                <Stack direction="horizontal" alignment="center" gap="2">
                    <Button
                        variant="primary"
                        icon="addCircle"
                        onClick={handleNewMonitorClick}
                        label="Add a Monitor"
                    />
                    <Button
                        icon="close"
                        onClick={handleCloseClick}
                    />
                </Stack>
            </Stack>

            {/* Error Bar */}
            {status === 'error' && (
                <Message variant="danger">
                    {`${error.statusCode}, ${error.message}`}
                </Message>
            )}

            {/* Loading indicator for page content */}
            {status === 'loading' && (
                <Stack className="ml-auto" alignment="center">
                    <Spinner variant="primary" />
                    Loading...
                </Stack>
            )}

            {status === 'success' && data.pages[0]?.monitors.length ? (
                <DataGrid columns={5}>
                    <DataGridRow>
                        <DataGridHeadCell>ID/Name</DataGridHeadCell>
                        <DataGridHeadCell>Created</DataGridHeadCell>
                        <DataGridHeadCell>Updated</DataGridHeadCell>
                        <DataGridHeadCell>Status</DataGridHeadCell>
                        <DataGridHeadCell>Options</DataGridHeadCell>
                    </DataGridRow>

                    {/* Render items: */}
                    {data.pages.map((group, i) =>
                        group.monitors.map((monitor, index) => (
                            <MonitorListItem key={index} monitor={monitor}/>)
                        )
                    )}
                </DataGrid>
            ) : (
                <div className="m-2">There are no Monitors to display.</div>
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
                    progress={isFetching}
                    label={isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                />
            </Box>
        </Stack>
    )
}

export default MonitorList
