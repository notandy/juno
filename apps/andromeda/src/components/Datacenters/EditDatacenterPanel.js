import React, {useEffect, useState} from "react"
import {
    Button,
    CheckboxRow,
    Form,
    Message,
    PanelBody,
    PanelFooter,
    SelectOption,
    SelectRow,
    Spinner,
    Stack,
    TextInputRow,
} from "juno-ui-components"
import useStore from "../../store"
import {currentState} from "url-state-provider"
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {fetchItem, updateItem} from "../../actions"

const EditDatacenterPanel = ({closeCallback}) => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const endpoint = useStore((state) => state.endpoint)
    const urlState = currentState(urlStateKey)
    const queryClient = useQueryClient()
    const [formState, setFormState] = useState({})
    const {isSuccess, isLoading, isError, data, error} = useQuery(
        ["datacenters", urlState.id, endpoint],
        fetchItem)
    const datacenterMutation = useMutation(updateItem)

    useEffect(() => {
        if (isSuccess) {
            // Remove unneded attributes from response
            const {
                project_id,
                created_at,
                updated_at,
                id,
                meta,
                provisioning_status,
                scope,
                ...saneData
            } = data.datacenter
            setFormState(saneData)
        }
    }, [isSuccess])

    const onSubmit = () => {
        datacenterMutation.mutate(
            {
                key: "datacenters",
                id: urlState.id,
                endpoint: endpoint,
                formState: {"datacenter": formState},
            },
            {
                onSuccess: (data, variables, context) => {
                    closeCallback()
                    // refetch datacenters
                    queryClient.invalidateQueries("datacenters")
                },
            }
        )
    }

    const handleChange = (event) => {
        setFormState({...formState, [event.target.name]: event.target.value});
    };

    return (
        <Form onSubmit={(e) => e.preventDefault()}>
            <PanelBody
                footer={
                    <PanelFooter>
                        <Button label="Cancel" variant="subdued" onClick={closeCallback}/>
                        <Button label="Save" type="submit" variant="primary" onClick={onSubmit}/>
                    </PanelFooter>
                }
            >
                {/* Error Bar */}
                {isError && (
                    <Message variant="danger">
                        {`${error.statusCode}, ${error.message}`}
                    </Message>
                )}
                {datacenterMutation.isError && (
                    <Message variant="danger">
                        {`${datacenterMutation.error.statusCode}, ${datacenterMutation.error.message}`}
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
                    checked={formState?.admin_state_up}
                    onChange={(event) => setFormState({...formState, admin_state_up: event.target.checked})}
                />
                <TextInputRow
                    label="Name"
                    disabled={isLoading}
                    name="name"
                    value={formState?.name}
                    onChange={handleChange}
                />
                <SelectRow
                    label="Continent"
                    disabled={isLoading}
                    name="continent"
                    helptext="A two-letter code that specifies the continent where the data center maps to."
                    value={formState?.continent}
                    onChange={handleChange}
                >
                    <SelectOption label="Unknown"/>
                    <SelectOption key="AF" label="AF - Africa" value="AF"/>
                    <SelectOption key="AN" label="AN - Antarctica" value="AN"/>
                    <SelectOption key="AS" label="AS - Asia" value="AS"/>
                    <SelectOption key="EU" label="EU - Europe" value="EU"/>
                    <SelectOption key="NA" label="NA - North america" value="NA"/>
                    <SelectOption key="OC" label="OC - Oceania" value="OC"/>
                    <SelectOption key="SA" label="SA - South america" value="SA"/>
                </SelectRow>
                <TextInputRow
                    label="Country"
                    disabled={isLoading}
                    name="country"
                    helptext="A two-letter ISO 3166 country code that specifies the country where the data center maps to."
                    value={formState?.country}
                    onChange={handleChange}
                />
                <TextInputRow
                    label="State or Province"
                    disabled={isLoading}
                    name="state_or_province"
                    helptext="The name of the state or province where the data center is located."
                    value={formState.state_or_province}
                    onChange={handleChange}
                />
                <TextInputRow
                    label="City"
                    disabled={isLoading}
                    name="city"
                    helptext="The name of the city where the data center is located."
                    value={formState.city}
                    onChange={handleChange}
                />
                <Stack gap="2">
                    <TextInputRow
                        label="Longitude"
                        disabled={isLoading}
                        type="number"
                        helptext="Specifies the geographical longitude of the data center's position."
                        value={formState.longitude?.toString()}
                        onChange={(event) => setFormState({...formState, longitude: parseFloat(event.target.value)})}
                    />
                    <TextInputRow
                        label="Latitude"
                        disabled={isLoading}
                        type="number"
                        helptext="Specifies the geographic latitude of the data center's position."
                        value={formState.latitude?.toString()}
                        onChange={(event) => setFormState({...formState, latitude: parseFloat(event.target.value)})}
                    />
                </Stack>
            </PanelBody>
        </Form>
    )
}

export default EditDatacenterPanel
