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
import {authStore, useStore} from "../../../store"
import {currentState} from "url-state-provider"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {fetchItem, updateAttributes, updateItem} from "../../../actions"
import DatacenterMenu from "./DatacenterMenu";
import {Error, Loading} from "../../Components";

const EditMemberPanel = ({closeCallback}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const auth = authStore((state) => state.auth)
    const urlState = currentState(urlStateKey)
    const queryClient = useQueryClient()
    const [error, setError] = useState()
    const [formState, setFormState] = useState({
        name: undefined,
        address: undefined,
        datacenter_id: undefined,
        port: undefined,
        admin_state_up: undefined,
    })

    const {isLoading} = useQuery(
        ["members", urlState.id, endpoint],
        fetchItem, {
            meta: auth?.token,
            onError: setError,
            onSuccess: (data) => setFormState(updateAttributes(formState, data.pool)),
            refetchOnWindowFocus: false,
        })
    const mutation = useMutation(updateItem)

    const onSubmit = () => {
        mutation.mutate(
            {
                key: "members",
                id: urlState.id,
                endpoint: endpoint,
                token: auth?.token,
                formState: {"member": formState},
            },
            {
                onSuccess: (data) => {
                    queryClient
                        .setQueryData(["members", data.member.id, endpoint], data)
                    queryClient
                        .invalidateQueries("members")
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
