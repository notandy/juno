import React, {useState} from "react"

import useStore from "../../../store"
import {createItem} from "../../../actions"
import {CheckboxRow, Message, Modal, TextInputRow} from "juno-ui-components"
import {useMutation, useQueryClient} from "@tanstack/react-query";
import DatacenterMenu from "./DatacenterMenu";
import {currentState, push} from "url-state-provider";

const NewMemberModal = ({poolID}) => {
    const endpoint = useStore((state) => state.endpoint)
    const urlStateKey = useStore((state) => state.urlStateKey)
    const queryClient = useQueryClient()
    const [formState, setFormState] = useState({
        name: undefined,
        address: undefined,
        datacenter_id: undefined,
        port: undefined,
        admin_state_up: true,
        pool_id: poolID,
    })
    const [error, setError] = useState()
    const mutation = useMutation(
        ({endpoint, body}) => createItem("members", endpoint, body)
    )

    const closeModal = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: ""})
    }

    const onSubmit = () => {
        mutation.mutate(
            {
                endpoint: endpoint,
                body: {"member": formState},
            },
            {
                onSuccess: () => {
                    closeModal()
                    // refetch
                    queryClient.invalidateQueries("members")
                },
                onError: setError
            }
        )
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    };

    return (
        <Modal
            title="Add new Member"
            open
            onCancel={closeModal}
            confirmButtonLabel="Save new Member"
            onConfirm={onSubmit}
        >
            {error && (
                <Message variant="danger">
                    {`${error.statusCode}, ${error.message}`}
                </Message>
            )}
            <CheckboxRow
                id="selectable"
                label="Enabled"
                checked={formState.admin_state_up}
                onChange={(event) => setFormState({...formState, admin_state_up: event.target.checked})}
            />
            <TextInputRow
                label="Name"
                name="name"
                value={formState.name}
                onChange={handleChange}
            />
            <TextInputRow
                label="IP address"
                name="address"
                value={formState.address}
                onChange={handleChange}
                required
            />
            <TextInputRow
                label="Port"
                type="number"
                value={formState.port?.toString()}
                onChange={(event) => setFormState({...formState, port: parseInt(event.target.value)})}
                required
            />
            Select a Datacenter
            <DatacenterMenu formState={formState} setFormState={setFormState} setError={setError}/>
        </Modal>
    )
}

export default NewMemberModal
