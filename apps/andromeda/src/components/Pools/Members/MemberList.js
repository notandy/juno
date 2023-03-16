import React from "react"
import {Box, Button, DataGrid, DataGridHeadCell, DataGridRow, Message, Spinner, Stack,} from "juno-ui-components"
import MemberListItem from "./MemberListItem"
import useStore from "../../../store"
import {currentState, push} from "url-state-provider"
import {fetchAll, nextPageParam} from "../../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';

const MemberList = ({poolID, setSelectedPool}) => {
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
        [`members`, endpoint, {pool_id: poolID}],
        fetchAll,
        {getNextPageParam: nextPageParam}
    )
    const handleNewMemberClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentModal: "NewMembersItem",
        })
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
                    <strong>Associated Members</strong>
                </div>
                <Stack direction="horizontal" alignment="center" gap="2">
                    <Button
                        variant="primary"
                        icon="addCircle"
                        onClick={handleNewMemberClick}
                        label="Add a Member"
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
                    <Spinner variant="primary"/>
                    Loading...
                </Stack>
            )}

            {status === 'success' && data.pages[0]?.members.length ? (
                <DataGrid columns={6}>
                    <DataGridRow>
                        <DataGridHeadCell>ID/Name</DataGridHeadCell>
                        <DataGridHeadCell>Address</DataGridHeadCell>
                        <DataGridHeadCell>Port</DataGridHeadCell>
                        <DataGridHeadCell>Datacenter</DataGridHeadCell>
                        <DataGridHeadCell>Status</DataGridHeadCell>
                        <DataGridHeadCell>Options</DataGridHeadCell>
                    </DataGridRow>

                    {/* Render items: */}
                    {data.pages.map((group, i) =>
                        group.members.map((member, index) => (
                            <MemberListItem key={index} member={member}/>)
                        )
                    )}
                </DataGrid>
            ) : (
                <div className="m-2">There are no members to display.</div>
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

export default MemberList
