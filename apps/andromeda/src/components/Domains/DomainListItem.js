import React, {useMemo} from "react"

import {DataGridCell, DataGridRow, Icon, Spinner, Stack} from "juno-ui-components"
import {authStore, useStore} from "../../store"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {currentState, push} from "url-state-provider"
import {deleteItem} from "../../actions"
import {DateTime} from "luxon";

const DomainListItem = ({domain, setError}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
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

    const {mutate} = useMutation(deleteItem)

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
                key: "domains",
                endpoint: endpoint,
                id: domain.id,
                token: auth?.token
            },
            {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries(["domains", endpoint])
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
                    {domain.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small"/> : null}
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
