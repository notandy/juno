import React, {useState} from "react"

import {
    Button,
    ButtonRow,
    CheckboxRow,
    Form,
    Message,
    PanelBody,
    PanelFooter,
    SelectOption,
    SelectRow,
    Spinner,
    Stack,
    TextareaRow,
    TextInputRow,
} from "juno-ui-components"
import {authStore, useStore} from "../../../store"
import {currentState} from "url-state-provider"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {fetchItem, updateAttributes, updateItem} from "../../../actions"
import {Error, Loading} from "../../Components";

const EditMonitorPanel = ({closeCallback}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const urlState = currentState(urlStateKey)
    const queryClient = useQueryClient()
    const [error, setError] = useState()
    const [advancedSettings, setAdvancedSettings] = useState(false)
    const [formState, setFormState] = useState({
        name: undefined,
        send: undefined,
        receive: undefined,
        timeout: undefined,
        type: undefined,
        interval: undefined,
        admin_state_up: undefined,
    })

    const {isLoading} = useQuery(
        ["monitors", urlState.id, endpoint],
        fetchItem, {
            meta: auth?.token,
            onError: setError,
            onSuccess: (data) => setFormState(updateAttributes(formState, data.monitor)),
            refetchOnWindowFocus: false,
        }
    )
    const mutation = useMutation(updateItem)

    const onSubmit = () => {
        mutation.mutate(
            {
                key: "monitors",
                id: urlState.id,
                endpoint: endpoint,
                token: auth?.token,
                formState: {"monitor": formState},
            },
            {
                onSuccess: (data) => {
                    queryClient
                        .setQueryData(["monitors", data.monitor.id, endpoint], data)
                    queryClient
                        .invalidateQueries("monitors")
                        .then(closeCallback)
                },
                onError: setError
            }
        )
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    };

    return (
        <Form>
            <PanelBody
                footer={
                    <PanelFooter>
                        <Button label="Cancel" variant="subdued" onClick={closeCallback}/>
                        <Button label="Save" variant="primary" onClick={onSubmit}/>
                    </PanelFooter>
                }
            >
                {/* Error Bar */}
                <Error error={error} />

                {/* Loading indicator for page content */}
                <Loading isLoading={isLoading || mutation.isLoading} />

                <CheckboxRow
                    id="selectable"
                    label="Enabled"
                    disabled={isLoading}
                    checked={formState.admin_state_up}
                    onChange={(event) => setFormState({...formState, admin_state_up: event.target.checked})}
                />
                <TextInputRow
                    label="Name"
                    name="name"
                    disabled={isLoading}
                    value={formState.name}
                    onChange={handleChange}
                />
                <TextInputRow
                    label="Interval"
                    name="interval"
                    disabled={isLoading}
                    type="number"
                    value={formState.interval?.toString()}
                    onChange={(event) => setFormState({...formState, interval: parseInt(event.target.value)})}
                />
                <TextInputRow
                    label="Timeout"
                    name="timeout"
                    disabled={isLoading}
                    type="number"
                    value={formState.timeout?.toString()}
                    onChange={(event) => setFormState({...formState, timeout: parseInt(event.target.value)})}
                />
                <SelectRow
                    label="Type"
                    name="type"
                    disabled={isLoading}
                    value={formState.type}
                    onChange={handleChange}
                >
                    <SelectOption key="icmp" value="ICMP" label="ICMP"/>
                    <SelectOption key="http" value="HTTP" label="HTTP"/>
                    <SelectOption key="https" value="HTTPS" label="HTTPS"/>
                    <SelectOption key="tcp" value="TCP" label="TCP"/>
                    <SelectOption key="udp" value="UDP" label="UDP"/>
                </SelectRow>
                <ButtonRow>
                    <Button
                        label="Show advanced settings"
                        disabled={isLoading}
                        variant="subdued"
                        onClick={() => setAdvancedSettings(!advancedSettings)}
                    />
                </ButtonRow>

                {advancedSettings && (
                    <Stack gap="2" distribution="between">
                        <TextareaRow
                            label="Monitor send message"
                            disabled={isLoading}
                            value={formState.send || ""}
                            onChange={handleChange}
                        />
                        <TextareaRow
                            label="Monitor expected receive message"
                            disabled={isLoading}
                            value={formState.receive || ""}
                            onChange={handleChange}
                        />
                    </Stack>)}
            </PanelBody>
        </Form>
    )
}

export default EditMonitorPanel
