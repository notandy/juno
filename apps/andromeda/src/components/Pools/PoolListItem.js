import React, {useEffect, useMemo, useState} from "react"
import {Badge, DataGridCell, DataGridRow, Icon, Label, Spinner, Stack} from "juno-ui-components"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {currentState, push} from "url-state-provider"
import {deleteItem} from "../../actions"
import {DateTime} from "luxon";
import useStore from "../../store"

const PoolListItem = ({ pool, setSelectedPool, isActive }) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const queryClient = useQueryClient()
    const createdAt = useMemo(() => {
        if (pool.created_at) {
            return DateTime.fromSQL(pool.created_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [pool.created_at])
    const updatedAt = useMemo(() => {
        if (pool.updated_at) {
            return DateTime.fromSQL(pool.updated_at).toLocaleString(
                DateTime.DATETIME_SHORT
            )
        }
    }, [pool.updated_at])

    const { isLoading, isError, error, data, isSuccess, mutate } = useMutation(
        ({ endpoint, id }) => deleteItem("pools", endpoint, id)
    )

    const handleEditPoolClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            currentPanel: "Pool",
            id: pool.id,
        })
    }

    const handleDeletePoolClick = () => {
        mutate(
            {
                endpoint: endpoint,
                id: pool.id,
            },
            {
                onSuccess: (data, variables, context) => {
                    // refetch pools
                    queryClient.invalidateQueries("pools")
                },
                onError: (error, variables, context) => {
                    console.log(error)
                    // TODO display error
                },
            }
        )
    }

    const handlePoolClick = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {
            ...urlState,
            pool: pool.id,
        })
        setSelectedPool(pool.id)
    }

    return (
        <DataGridRow>
            <DataGridCell>
                <Stack alignment="center">
                    {pool.provisioning_status !== 'ACTIVE' ? <Spinner variant="primary" size="small" /> : null}
                    <div
                        className={`cursor-pointer ${isActive ? "jn-text-theme-accent" : "hover:text-theme-accent"}`}
                        onClick={handlePoolClick}
                    >
                        {pool.name || pool.id}
                    </div>
                </Stack>
            </DataGridCell>
            <DataGridCell>{pool.domains?.length || 0}/{pool.members?.length || 0}/{pool.monitors?.length || 0}</DataGridCell>
            <DataGridCell>{createdAt}</DataGridCell>
            <DataGridCell>{updatedAt}</DataGridCell>
            <DataGridCell>
                <Badge
                    variant={pool.status === "OFFLINE" ? "danger" : "info"}
                    text={pool.status}
                />
            </DataGridCell>
            <DataGridCell>
                {/* Use <Stack> to align and space elements: */}
                <Stack gap="1.5">
                    <Icon
                        icon="edit"
                        size="18"
                        className="leading-none"
                        onClick={handleEditPoolClick}
                    />
                    <Icon
                        icon="deleteForever"
                        size="18"
                        className="leading-none"
                        onClick={handleDeletePoolClick}
                    />
                </Stack>
            </DataGridCell>
        </DataGridRow>
    )
}

export default PoolListItem
