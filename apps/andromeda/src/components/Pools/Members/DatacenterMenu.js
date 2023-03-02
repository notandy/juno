import React from "react";

import {Menu} from "juno-ui-components/build/Menu";
import {MenuItem} from "juno-ui-components/build/MenuItem";
import {useInfiniteQuery} from "@tanstack/react-query";
import {fetchAll, nextPageParam} from "../../../actions";
import useStore from "../../../store";


const DatacenterMenu = ({formState, setFormState, setError}) => {
    const endpoint = useStore((state) => state.endpoint)
    const {
        isLoading,
        data,
        hasNextPage,
        fetchNextPage,
        isFetching
    } = useInfiniteQuery(["datacenters", endpoint], fetchAll, {
        getNextPageParam: nextPageParam, onError: setError
    })

    return (
        <Menu variant="small">
            {/* Render items: */}
            {data?.pages.map((group, i) => group.datacenters.map((datacenter, index) => (
                <MenuItem
                    key={datacenter.id}
                    icon={formState.datacenter_id === datacenter.id ? "checkCircle" : "addCircle"}
                    label={`${datacenter.name || datacenter.id}`}
                    onClick={() => setFormState({
                        ...formState,
                        datacenter_id: datacenter.id === formState.datacenter_id ? undefined : datacenter.id,
                    })}
                    className={formState.datacenter_id === datacenter.id ? "jn-text-theme-info" : ""}
                />
            )))}
            {hasNextPage && (
                <MenuItem
                    label={isLoading ? "Loading..." :
                        isFetching ? 'Loading more...'
                            : hasNextPage
                                ? 'Load More'
                                : 'Nothing more to load'}
                    onClick={hasNextPage ? () => fetchNextPage() : undefined}
                    icon={hasNextPage ? "expandMore" : "info"}
                />
            )}
        </Menu>
    )
}

export default DatacenterMenu