import React, { useMemo } from "react"
import {Container, DataGridCell, DataGridRow, Icon, Label, Spinner, Stack} from "juno-ui-components"
import useStore from "../../../store"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { currentState, push } from "url-state-provider"
import {deleteItem} from "../../../actions"
import {DateTime} from "luxon";

const MonitorListItem = ({ monitor }) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
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

    const { isLoading, isError, error, data, isSuccess, mutate } = useMutation(
        ({ endpoint, id }) => deleteItem("monitors", endpoint, id)
    )

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
                endpoint: endpoint,
                id: monitor.id,
            },
            {
                onSuccess: (data, variables, context) => {
                    // refetch monitors
                    queryClient.invalidateQueries("monitors")
                },
                onError: (error, variables, context) => {
                    console.log(error)
                    // TODO display error
                },
            }
        )
    }

    return (
        <DataGridRow>
            <DataGridCell>
                <Stack alignment="center">
                    {monitor.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small" /> : null}
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
