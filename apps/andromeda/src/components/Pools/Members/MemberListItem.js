import React from "react"

import {DataGridCell, DataGridRow, Icon, Spinner, Stack} from "juno-ui-components"
import {authStore, useStore} from "../../../store"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {currentState, push} from "url-state-provider"
import {deleteItem, fetchItem} from "../../../actions"

const MemberListItem = ({ member, setError }) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const queryClient = useQueryClient()

    const queryDatacenter = useQuery(
        [`datacenters`, member.datacenter_id, endpoint],
        fetchItem,
        {
            meta: auth?.token,
            onError: setError,
        }
    )
    const mutation = useMutation(deleteItem)

    const handleEditMemberClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentPanel: "Member",
            id: member.id,
        })
    }

    const handleDeleteMemberClick = () => {
        mutation.mutate(
            {
                key: "members",
                endpoint: endpoint,
                id: member.id,
                token: auth?.token,
            },
            {
                onSuccess: () => {
                    queryClient
                        .invalidateQueries("members")
                        .then()
                },
                onError: setError,
            }
        )
    }

    return (
        <DataGridRow className={member.admin_state_up ? "" : "text-theme-background-lvl-4"}>
            <DataGridCell>
                <Stack alignment="center">
                    {member.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small" /> : null}
                    {member.name || member.id}
                </Stack>
            </DataGridCell>
            <DataGridCell>{member.address}</DataGridCell>
            <DataGridCell>{member.port}</DataGridCell>
            <DataGridCell>{queryDatacenter.data?.datacenter.name}</DataGridCell>
            <DataGridCell><Icon icon={member.status === 'UNKNOWN' && "warning"} /></DataGridCell>
            <DataGridCell>
                {/* Use <Stack> to align and space elements: */}
                <Stack gap="1.5">
                    <Icon
                        icon="edit"
                        size="18"
                        className="leading-none"
                        onClick={handleEditMemberClick}
                    />
                    <Icon
                        icon="deleteForever"
                        size="18"
                        className="leading-none"
                        onClick={handleDeleteMemberClick}
                    />
                </Stack>
            </DataGridCell>
        </DataGridRow>
    )
}

export default MemberListItem
