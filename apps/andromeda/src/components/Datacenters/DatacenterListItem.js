import React, {useMemo} from "react"
import {DataGridCell, DataGridRow, Icon, Stack} from "juno-ui-components"
import {authStore, useStore} from "../../store"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {currentState, push} from "url-state-provider"
import {deleteItem} from "../../actions"
import {DateTime} from "luxon";

const DatacenterListItem = ({datacenter, setError}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const queryClient = useQueryClient()
    const createdAt = useMemo(() => {
        if (datacenter.created_at) {
            return DateTime.fromSQL(datacenter.created_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [datacenter.created_at])
    const updatedAt = useMemo(() => {
        if (datacenter.updated_at) {
            return DateTime.fromSQL(datacenter.updated_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [datacenter.updated_at])
    const mutation = useMutation(deleteItem)

    const handleEditDatacenterClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentPanel: "Datacenter",
            id: datacenter.id,
        })
    }

    const handleDeleteDatacenterClick = () => {
        mutation.mutate(
            {
                key: "datacenters",
                endpoint: endpoint,
                id: datacenter.id,
                token: auth?.token,
            },
            {
                onSuccess: () => {
                    // refetch datacenters
                    queryClient.invalidateQueries("datacenters").then()
                },
                onError: setError
            }
        )
    }

    return (
        <DataGridRow>
            <DataGridCell>
                <strong>{datacenter.name || datacenter.id}</strong>
            </DataGridCell>
            <DataGridCell>{datacenter.continent}</DataGridCell>
            <DataGridCell>{datacenter.country}</DataGridCell>
            <DataGridCell>{datacenter.state_or_province}</DataGridCell>
            <DataGridCell>{datacenter.city}</DataGridCell>
            <DataGridCell>{datacenter.latitude}, {datacenter.longitude}</DataGridCell>
            <DataGridCell>{createdAt}</DataGridCell>
            <DataGridCell>{updatedAt}</DataGridCell>
            <DataGridCell>
                {/* Use <Stack> to align and space elements: */}
                <Stack gap="1.5">
                    <Icon
                        icon="edit"
                        size="18"
                        className="leading-none"
                        onClick={handleEditDatacenterClick}
                    />
                    <Icon
                        icon="deleteForever"
                        size="18"
                        className="leading-none"
                        onClick={handleDeleteDatacenterClick}
                    />
                    <Icon
                        icon="openInNew"
                        size="18"
                        href={`http://www.google.com/maps/place/${datacenter.latitude},${datacenter.longitude}`}
                        target="_blank"
                        className="leading-none"
                    />
                </Stack>
            </DataGridCell>
        </DataGridRow>
    )
}

export default DatacenterListItem
