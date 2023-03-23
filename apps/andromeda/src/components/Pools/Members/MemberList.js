import React, {useState} from "react"

import {Box, Button, DataGrid, DataGridHeadCell, DataGridRow, Stack,} from "juno-ui-components"
import MemberListItem from "./MemberListItem"
import {authStore, useStore} from "../../../store"
import {currentState, push} from "url-state-provider"
import {fetchAll, nextPageParam} from "../../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';
import {Error, Loading} from "../../Components";

const MemberList = ({poolID, setSelectedPool}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const [error, setError] = useState()

    const {
        data,
        isLoading,
        isSuccess,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
    } = useInfiniteQuery(
        [`members`, endpoint, {pool_id: poolID}],
        fetchAll,
        {
            getNextPageParam: nextPageParam,
            meta: auth?.token,
            onError: setError,
        }
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
            <Error error={error} />

            {/* Loading indicator for page content */}
            <Loading isLoading={isLoading} />


            {isSuccess && data.pages[0]?.members.length ? (
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
                            <MemberListItem key={index} member={member} setError={setError}/>)
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
