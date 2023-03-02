import React, { useMemo } from "react"
import {DataGridCell, DataGridRow, Icon, Spinner, Stack} from "juno-ui-components"
import useStore from "../../store"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { currentState, push } from "url-state-provider"
import {deleteItem} from "../../actions"
import {DateTime} from "luxon";

const DomainListItem = ({ domain }) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const queryClient = useQueryClient()
    const createdAt = useMemo(() => {
        if (domain.created_at) {
            return DateTime.fromSQL(domain.created_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [domain.created_at])
    const updatedAt = useMemo(() => {
        if (domain.updated_at) {
            return DateTime.fromSQL(domain.updated_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [domain.updated_at])

    const { isLoading, isError, error, data, isSuccess, mutate } = useMutation(
        ({ endpoint, id }) => deleteItem("domains", endpoint, id)
    )

    const handleEditDomainClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentPanel: "Domain",
            id: domain.id,
        })
    }

    const handleDeleteDomainClick = () => {
        mutate(
            {
                endpoint: endpoint,
                id: domain.id,
            },
            {
                onSuccess: (data, variables, context) => {
                    // refetch domains
                    queryClient.invalidateQueries("domains")
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
                    {domain.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small" /> : null}
                    {domain.name || domain.id}
                </Stack>
            </DataGridCell>
            <DataGridCell>{domain.fqdn}</DataGridCell>
            <DataGridCell>{domain.record_type}</DataGridCell>
            <DataGridCell>{domain.provider}</DataGridCell>
            <DataGridCell>{createdAt}</DataGridCell>
            <DataGridCell>{updatedAt}</DataGridCell>
            <DataGridCell>{domain.status}</DataGridCell>
            <DataGridCell>
                {/* Use <Stack> to align and space elements: */}
                <Stack gap="1.5">
                    <Icon
                        icon="edit"
                        size="18"
                        className="leading-none"
                        onClick={handleEditDomainClick}
                    />
                    <Icon
                        icon="deleteForever"
                        size="18"
                        className="leading-none"
                        onClick={handleDeleteDomainClick}
                    />
                    <Icon
                        icon="openInNew"
                        size="18"
                        href={domain.fqdn}
                        target="_blank"
                        className="leading-none"
                    />
                </Stack>
            </DataGridCell>
        </DataGridRow>
    )
}

export default DomainListItem
