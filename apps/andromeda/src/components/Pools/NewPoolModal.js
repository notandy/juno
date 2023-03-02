import React, {useState} from "react"

import useStore from "../../store"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {createItem} from "../../actions"
import {CheckboxRow, Message, Modal, TextInputRow} from "juno-ui-components"
import DomainMenu from "./DomainMenu";
import {currentState, push} from "url-state-provider";

const NewPoolModal = () => {
    const endpoint = useStore((state) => state.endpoint)
    const urlStateKey = useStore((state) => state.urlStateKey)
    const queryClient = useQueryClient()
    const [error, setError] = useState()
    const [formState, setFormState] = useState({
        name: undefined,
        admin_state_up: true,
        domains: [],
    })
    const mutation = useMutation(({endpoint, body}) => createItem("pools", endpoint, body))

    const closeModal = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: ""})
    }

    const onSubmit = () => {
        mutation.mutate({
            endpoint: endpoint, body: {"pool": formState},
        }, {
            onSuccess: () => {
                closeModal()
                // refetch
                queryClient.invalidateQueries("pools")
            },
            onError: setError,
        })
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    };

    return (
        <Modal
            title="Add new Pool"
            open
            onCancel={closeModal}
            confirmButtonLabel="Save new Pool"
            onConfirm={onSubmit}
        >
            {/* Error Bar */}
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

            Associated Domain(s):
            <DomainMenu formState={formState} setFormState={setFormState} setError={setError}/>
        </Modal>
    )
}

export default NewPoolModal
