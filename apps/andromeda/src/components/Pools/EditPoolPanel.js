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
import useStore from "../../store"
import {currentState} from "url-state-provider"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {fetchItem, updateAttributes, updateItem} from "../../actions"
import DomainMenu from "./DomainMenu";

const EditPoolPanel = ({closeCallback}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const urlState = currentState(urlStateKey)
    const queryClient = useQueryClient()
    const [formState, setFormState] = useState({
        name: undefined, admin_state_up: true, domains: [],
    })
    const [error, setError] = useState()
    const {isLoading} = useQuery(
        ["pools", urlState.id, endpoint],
        fetchItem, {
            onError: setError,
            onSuccess: (data) => setFormState(updateAttributes(formState, data.pool))
        })
    const mutation = useMutation(updateItem)

    const onSubmit = () => {
        mutation.mutate(
            {
                key: "pools",
                id: urlState.id,
                endpoint: endpoint,
                formState: {pool: formState},
            },
            {
                onSuccess: () => {
                    closeCallback()
                    // refetch pools
                    queryClient.invalidateQueries("pools")
                },
                onError: setError
            }
        )
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    }

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
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
                {isLoading && (
                    <Stack direction="horizontal" alignment="center" distribution="center">
                        <Spinner variant="primary" size="large"/>
                        Loading...
                    </Stack>
                )}

                <CheckboxRow
                    id="selectable"
                    label="Enabled"
                    disabled={isLoading}
                    checked={formState.admin_state_up}
                    onChange={(event) => setFormState({...formState, admin_state_up: event.target.checked})}
                />
                <TextInputRow
                    label="Name"
                    disabled={isLoading}
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                />
                Associated Domain(s):
                {isLoading && <Spinner/>}
                <DomainMenu formState={formState} setFormState={setFormState} setError={setError}/>
            </PanelBody>
        </Form>
    )
}

export default EditPoolPanel
