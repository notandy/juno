import React, { useState, useEffect } from "react"
import {
  Button, Checkbox,
  Form,
  PanelBody,
  PanelFooter, SelectOption, SelectRow, Stack,
  TextInputRow,
} from "juno-ui-components"
import useStore from "../../store"
import { currentState, push } from "url-state-provider"
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { fetchItem, updateItem } from "../../actions"

const EditDomainPanel = ({ closeCallback }) => {
  const urlStateKey = useStore((state) => state.urlStateKey)
  const endpoint = useStore((state) => state.endpoint)
  const urlState = currentState(urlStateKey)
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState({})

  const domainFetch = useQuery(["domains",  urlState.domainId, endpoint], fetchItem)
  const domainMutation = useMutation(updateItem)

  useEffect(() => {
    if (domainFetch.isSuccess) {
      setFormState({
        name: domainFetch.data.domain.name,
        provider: domainFetch.data.domain.provider,
        fqdn: domainFetch.data.domain.fqdn,
        record_type: domainFetch.data.domain.record_type,
        admin_state_up: domainFetch.data.domain.admin_state_up
      })
    }
  }, [domainFetch.isSuccess])

  const onSubmit = () => {
    domainMutation.mutate(
      {
        key: "domains",
        id: urlState.domainId,
        endpoint: endpoint,
        formState: {"domain": formState},
      },
      {
        onSuccess: (data, variables, context) => {
          closeCallback()
          // refetch domains
          queryClient.invalidateQueries("domains")
        },
        onError: (error, variables, context) => {
          // TODO display error
        },
      }
    )
  }

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  return (
    <PanelBody
      footer={
        <PanelFooter>
          <Button label="Cancel" variant="subdued" onClick={closeCallback} />
          <Button label="Save" variant="primary" onClick={onSubmit} />
        </PanelFooter>
      }
    >
      <Form>
        <TextInputRow
            label="Name"
            name="name"
            value={formState?.name}
            onChange={handleChange}
        />
        <SelectRow
            label="Provider"
            name="provider"
            value={formState?.provider}
            onChange={handleChange}
            required
        >
          <SelectOption
              key="akamai"
              label="Akamai"
              value="akamai"
          />
        </SelectRow>
        <TextInputRow
            label="Fully Qualified Domain Name"
            name="fqdn"
            value={formState?.fqdn}
            onChange={handleChange}
            required
        />
        <SelectRow
            label="Record Type"
            name="record_type"
            value={formState?.record_type}
            onChange={handleChange}
        >
          <SelectOption
              label="A"
              value="A"
          />
          <SelectOption
              label="AAAA"
              value="AAAA"
          />
          <SelectOption
              label="CNAME"
              value="CNAME"
          />
          <SelectOption
              label="MX"
              value="MX"
          />
        </SelectRow>
        <Stack alignment="center">
          <Checkbox
              checked={formState?.admin_state_up}
              onChange={handleChange}
          />
          <span className="ml-2">
          {`Enabled`}
        </span>
        </Stack>
      </Form>
    </PanelBody>
  )
}

export default EditDomainPanel
