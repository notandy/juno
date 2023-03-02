import React, { useState } from "react"

import useStore from "../../store"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {createItem} from "../../actions"
import {Modal, TextInputRow, SelectRow, SelectOption, Checkbox, Stack, Message} from "juno-ui-components"
import { currentState, push } from "url-state-provider"
import { create } from 'zustand'

const NewDomainModal = () => {
  const urlStateKey = useStore((state) => state.urlStateKey)
  const endpoint = useStore((state) => state.endpoint)
  const queryClient = useQueryClient()
  const [formState, setFormState] = useState({
    name: "",
    provider: "akamai",
    fqdn: "",
    record_type: "A"
  })

  const { isLoading, isError, error, data, isSuccess, mutate } = useMutation(
    ({ endpoint, body }) => createItem("domains", endpoint, body)
  )

  const closeNewDomainModal = () => {
    const urlState = currentState(urlStateKey)
    push(urlStateKey, { ...urlState, currentModal: "" })
  }

  const onSubmit = () => {
    mutate(
      {
        endpoint: endpoint,
        body: {"domain": formState},
      },
      {
        onSuccess: (data, variables, context) => {
          closeNewDomainModal()
          // refetch
          queryClient.invalidateQueries("domains")
        }
      }
    )
  }

  const handleChange = (event) => {
    setFormState({ ...formState, [event.target.name]: event.target.value });
  };

  return (
    <Modal
      title="Add new Domain"
      open
      onCancel={closeNewDomainModal}
      confirmButtonLabel="Save new Domain"
      onConfirm={onSubmit}
    >
      {isError && (
      <Message variant="danger">
        {`${error.statusCode}, ${error.message}`}
      </Message>
      )}
      <TextInputRow
        label="Name"
        name="name"
        value={formState.name}
        onChange={handleChange}
      />
      <SelectRow
          label="Provider"
          name="provider"
          value={formState.provider}
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
        value={formState.fqdn}
        onChange={handleChange}
        required
      />
      <SelectRow
          label="Record Type"
          name="record_type"
          value={formState.record_type}
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
            checked
            onChange={(e) => {onAttrChanged("enabled", e.target.checked)}}
        />
        <span className="ml-2">
          {`Enabled`}
        </span>
      </Stack>
    </Modal>
  )
}

export default NewDomainModal
