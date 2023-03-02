import React, {useEffect, useState} from "react"

import {Box, Button, DataGrid, DataGridHeadCell, DataGridRow, Message, Spinner, Stack,} from "juno-ui-components"
import PoolListItem from "./PoolListItem"
import useStore from "../../store"
import {currentState, push} from "url-state-provider"
import {fetchAll, nextPageParam} from "../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';
import MemberList from "./Members/MemberList";
import MonitorList from "./Monitors/MonitorList";

const PoolList = () => {
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
        ["pools", endpoint],
        fetchAll,
        {getNextPageParam: nextPageParam}
    )
    const handleNewPoolClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: "NewPoolsItem"})
    }

    const [selectedPool, setSelectedPool] = useState("");
    useEffect(() => {
        const urlState = currentState(urlStateKey)
        if (urlState?.pool) setSelectedPool(urlState.pool)
    }, [urlStateKey])

    return (
        <>
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

            <Stack
                distribution="between"
                direction="horizontal"
                alignment="center"
                className="jn-px-6 jn-py-3 mt-6 jn-bg-theme-background-lvl-1">
                <div className="jn-text-lg jn-text-theme-high">
                    <strong>Pools</strong>
                </div>
                <Button
                    variant="primary"
                    icon="addCircle"
                    onClick={handleNewPoolClick}
                    label="Add a Pool"
                />
            </Stack>
            {status === 'success'? (
                <DataGrid columns={6}>
                    <DataGridRow>
                        <DataGridHeadCell>ID/Name</DataGridHeadCell>
                        <DataGridHeadCell>#Domains/#Members/#Monitors</DataGridHeadCell>
                        <DataGridHeadCell>Created</DataGridHeadCell>
                        <DataGridHeadCell>Updated</DataGridHeadCell>
                        <DataGridHeadCell>Status</DataGridHeadCell>
                        <DataGridHeadCell>Options</DataGridHeadCell>
                    </DataGridRow>

                    {/* Render items: */}
                    {data.pages.map((group, i) =>
                        group.pools.map((pool, index) => (
                            <PoolListItem
                                key={index}
                                pool={pool}
                                setSelectedPool={setSelectedPool}
                                isActive={selectedPool === pool.id}
                            />)
                        )
                    )}
                </DataGrid>
            ) : (
                <div>There are no pools to display.</div>
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

            {selectedPool && (
                <Stack direction="horizontal" gap="2">
                    <MemberList poolID={selectedPool} setSelectedPool={setSelectedPool} />
                    <MonitorList poolID={selectedPool} setSelectedPool={setSelectedPool} />
                </Stack>
            )}
        </>
    )
}

export default PoolList
