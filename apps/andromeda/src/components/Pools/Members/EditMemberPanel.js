import React, {useState} from "react"

import {
    Button,
    CheckboxRow,
    Form,
    Message,
    PanelBody,
    PanelFooter,
    Spinner,
    Stack,
    TextInputRow,
} from "juno-ui-components"
import useStore from "../../../store"
import {currentState} from "url-state-provider"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {fetchItem, updateAttributes, updateItem} from "../../../actions"
import DatacenterMenu from "./DatacenterMenu";

const EditMemberPanel = ({closeCallback}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const urlState = currentState(urlStateKey)
    const queryClient = useQueryClient()
    const [formState, setFormState] = useState({
        name: undefined,
        address: undefined,
        datacenter_id: undefined,
        port: undefined,
        admin_state_up: undefined,
    })
    const [error, setError] = useState()

    const {isLoading} = useQuery(
        ["members", urlState.id, endpoint],
        fetchItem, {
            onError: setError,
            onSuccess: (data) => setFormState(updateAttributes(formState, data.pool)),
        })
    const mutation = useMutation(updateItem)

    const onSubmit = () => {
        mutation.mutate(
            {
                key: "members",
                id: urlState.id,
                endpoint: endpoint,
                formState: {"member": formState},
            },
            {
                onSuccess: () => {
                    closeCallback()
                    // refetch members
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
                {error && (
                    <Message variant="danger">
                        {`${error.statusCode}, ${error.message}`}
                    </Message>
                )}

                {/* Loading indicator for page content */}
                {isLoading || mutation.isLoading && (
                    <Stack direction="horizontal" alignment="center" distribution="center">
                        <Spinner variant="primary" size="large"/>
                        Loading...
                    </Stack>
                )}

                <CheckboxRow
                    id="selectable"
                    label="Enabled"
                    checked={formState.admin_state_up}
                    disabled={isLoading}
                    onChange={(event) => setFormState({...formState, admin_state_up: event.target.checked})}
                />
                <TextInputRow
                    label="Name"
                    name="name"
                    value={formState.name}
                    disabled={isLoading}
                    onChange={handleChange}
                />
                <TextInputRow
                    label="IP address"
                    name="address"
                    value={formState.address}
                    disabled={isLoading}
                    onChange={handleChange}
                    required
                />
                <TextInputRow
                    label="Port"
                    type="number"
                    disabled={isLoading}
                    value={formState.port?.toString()}
                    onChange={(event) => setFormState({...formState, port: parseInt(event.target.value)})}
                    required
                />
                Select a Datacenter
                <DatacenterMenu formState={formState} setFormState={setFormState} setError={setError}/>
            </PanelBody>
        </Form>
    )
}

export default EditMemberPanel
