import React from "react"
import {
    Box,
    Button,
    ContentAreaToolbar,
    DataGrid,
    DataGridHeadCell,
    DataGridRow,
    Message,
    Spinner,
    Stack,
} from "juno-ui-components"
import DomainListItem from "./DomainListItem"
import useStore from "../../store"
import {currentState, push} from "url-state-provider"
import {fetchAll, nextPageParam} from "../../actions";
import {useInfiniteQuery} from '@tanstack/react-query';

const DomainList = ({ domains }) => {
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
        ["domains", endpoint, {limit: 3}],
        fetchAll,
        {getNextPageParam: nextPageParam}
    )
    const handleNewDomainClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: "NewDomainsItem"})
    }

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

            <ContentAreaToolbar>
                <Button
                    variant="primary"
                    icon="addCircle"
                    onClick={handleNewDomainClick}
                    label="Add a Domain"
                />
            </ContentAreaToolbar>
            {status === 'success'? (
                 <DataGrid columns={8}>
                    <DataGridRow>
                        <DataGridHeadCell>ID/Name</DataGridHeadCell>
                        <DataGridHeadCell>FQDN</DataGridHeadCell>
                        <DataGridHeadCell>Record Type</DataGridHeadCell>
                        <DataGridHeadCell>Provider</DataGridHeadCell>
                        <DataGridHeadCell>Created</DataGridHeadCell>
                        <DataGridHeadCell>Updated</DataGridHeadCell>
                        <DataGridHeadCell>Status</DataGridHeadCell>
                        <DataGridHeadCell>Options</DataGridHeadCell>
                    </DataGridRow>

                    {/* Render items: */}
                    {data.pages.map((group, i) =>
                        group.domains.map((domain, index) => (
                            <DomainListItem key={index} domain={domain}/>)
                        )
                    )}
                </DataGrid>
            ) : (
                <div>There are no domains to display.</div>
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
                    {isFetching ? <Spinner variant="primary" /> : null}
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

export default DomainList
