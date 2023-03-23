import React, {useMemo} from "react"

import {DataGridCell, DataGridRow, Icon, Spinner, Stack} from "juno-ui-components"
import {authStore, useStore} from "../../../store"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {currentState, push} from "url-state-provider"
import {deleteItem} from "../../../actions"
import {DateTime} from "luxon";

const MonitorListItem = ({monitor, setError}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const queryClient = useQueryClient()
    const createdAt = useMemo(() => {
        if (monitor.created_at) {
            return DateTime.fromSQL(monitor.created_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [monitor.created_at])
    const updatedAt = useMemo(() => {
        if (monitor.updated_at) {
            return DateTime.fromSQL(monitor.updated_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [monitor.updated_at])

    const {mutate} = useMutation(deleteItem)

    const handleEditMonitorClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentPanel: "Monitor",
            id: monitor.id,
        })
    }

    const handleDeleteMonitorClick = () => {
        mutate(
            {
                key: "monitors",
                endpoint: endpoint,
                id: monitor.id,
                token: auth?.token,
            },
            {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries("monitors")
                        .then()
                },
                onError: setError
            }
        )
    }

    return (
        <DataGridRow>
            <DataGridCell>
                <Stack alignment="center">
                    {monitor.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small"/> : null}
                    {monitor.name || monitor.id}
                </Stack>
            </DataGridCell>
            <DataGridCell>{createdAt}</DataGridCell>
            <DataGridCell>{updatedAt}</DataGridCell>
            <DataGridCell>{monitor.status}</DataGridCell>
            <DataGridCell>
                {/* Use <Stack> to align and space elements: */}
                <Stack gap="1.5">
                    <Icon
                        icon="edit"
                        size="18"
                        className="leading-none"
                        onClick={handleEditMonitorClick}
                    />
                    <Icon
                        icon="deleteForever"
                        size="18"
                        className="leading-none"
                        onClick={handleDeleteMonitorClick}
                    />
                </Stack>
            </DataGridCell>
        </DataGridRow>
    )
}

export default MonitorListItem
