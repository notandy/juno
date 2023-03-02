import React, {useState} from "react"

import useStore from "../../../store"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {createItem} from "../../../actions"
import {
    Modal,
    TextInputRow,
    Message,
    CheckboxRow,
    TextareaRow,
    SelectRow,
    SelectOption,
    ButtonRow, Button, Stack
} from "juno-ui-components"
import {currentState, push} from "url-state-provider"

const NewMonitorModal = ({poolID}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const queryClient = useQueryClient()
    const [formState, setFormState] = useState({
        name: "",
        pool_id: poolID,
        send: null,
        receive: null,
        timeout: 10,
        type: "ICMP",
        interval: 60,
        admin_state_up: true,
    })
    const [advancedSettings, setAdvancedSettings] = useState(false)

    const {isLoading, isError, error, data, isSuccess, mutate} = useMutation(
        ({endpoint, body}) => createItem(`monitors`, endpoint, body)
    )

    const closeNewMonitorModal = () => {
        const urlState = currentState(urlStateKey)
        push(urlStateKey, {...urlState, currentModal: ""})
    }

    const onSubmit = () => {
        mutate(
            {
                endpoint: endpoint,
                body: {"monitor": formState},
            },
            {
                onSuccess: (data, variables, context) => {
                    closeNewMonitorModal()
                    // refetch
                    queryClient.invalidateQueries(`monitors`)
                }
            }
        )
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    };

    return (
        <Modal
            title="Add new Monitor"
            open
            onCancel={closeNewMonitorModal}
            confirmButtonLabel="Save new Monitor"
            onConfirm={onSubmit}
        >
            {isError && (
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
                label="Interval"
                name="interval"
                type="number"
                value={formState.interval.toString()}
                onChange={(event) => setFormState({...formState, interval: parseInt(event.target.value)})}
            />
            <TextInputRow
                label="Timeout"
                name="timeout"
                type="number"
                value={formState.timeout.toString()}
                onChange={(event) => setFormState({...formState, timeout: parseInt(event.target.value)})}
            />
            <SelectRow
                label="Type"
                name="type"
                value={formState?.type}
                onChange={handleChange}
            >
                <SelectOption key="icmp" value="ICMP" label="ICMP" />
                <SelectOption key="http" value="HTTP" label="HTTP" />
                <SelectOption key="https" value="HTTPS" label="HTTPS" />
                <SelectOption key="tcp" value="TCP" label="TCP" />
                <SelectOption key="udp" value="UDP" label="UDP" />
            </SelectRow>
            <ButtonRow>
                <Button
                    label="Show advanced settings"
                    variant="subdued"
                    onClick={() => setAdvancedSettings(!advancedSettings)}
                />
            </ButtonRow>

            {advancedSettings && (
                <Stack gap="2" distribution="between">
                    <TextareaRow
                        label="Monitor send message"
                        value={formState.send || ""}
                        onChange={handleChange}
                    />
                    <TextareaRow
                        label="Monitor expected receive message"
                        value={formState.receive || ""}
                        onChange={handleChange}
                    />
                </Stack>)}

        </Modal>
    )
}

export default NewMonitorModal
