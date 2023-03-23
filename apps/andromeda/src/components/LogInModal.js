import React, {useState} from "react"

import {
    Button,
    ButtonRow,
    Form,
    IntroBox,
    LoadingIndicator,
    Modal,
    SelectOption,
    SelectRow,
    Stack,
    TextInputRow
} from "juno-ui-components"
import {authStore, useStore} from "../store"
import {currentState, push} from "url-state-provider";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login} from "../actions";
import heroImage from "../img/app_bg_example.svg?url"
import {Error} from "./Components";

const LogInModal = () => {
    const urlStateKey = useStore((state) => state.urlStateKey)
    const setAuth = authStore((state) => state.setAuth)
    const queryClient = useQueryClient()
    const {mutate, isLoading, error} = useMutation(login)
    const [credentials, setCredentials] = useState({
        username: undefined,
        password: undefined,
        domain: "monsoon3",
    })

    const onSubmit = (event) => {
        mutate({
                endpoint: "v3", credentials
            },
            {
                onSuccess: ([token, data]) => {
                    const auth = {
                        token: token,
                        ...data
                    }
                    setAuth(auth)
                    queryClient.invalidateQueries().then()
                    const urlState = currentState(urlStateKey)
                    push(urlStateKey, {...urlState, currentModal: ""})
                }
            }
        )
        event.preventDefault();
    }

    const handleChange = (event) => {
        setCredentials({...credentials, [event.target.name]: event.target.value});
    };

    return (
        <Modal
            title="Andromeda"
            closeable={false}
            open
        >
            <IntroBox
                heroImage={`url(${heroImage})`}
                text="Log in using your OpenStack Credentials."
                variant="hero"
            />

            {/* Error Bar */}
            <Error error={error}/>

            {/* Loading indicator for page content */}
            {isLoading && (
                <Stack alignment="center" className="jn-w-full" direction="vertical">
                    <LoadingIndicator color="jn-text-theme-info" className="jn-mb-8"/>
                </Stack>
            )}

            <Form onSubmit={onSubmit}>
                <SelectRow
                    label="Domain"
                    name="domain"
                    disabled={isLoading}
                    onChange={handleChange}
                    value="monsoon3"
                >
                    <SelectOption key="monsoon3" value="monsoon3" label="Monsoon3"/>
                </SelectRow>
                <TextInputRow
                    label="User Name"
                    name="username"
                    value={credentials.username}
                    disabled={isLoading}
                    onChange={handleChange}
                    required
                />
                <TextInputRow
                    label="Password"
                    name="password"
                    type="password"
                    value={credentials.password}
                    disabled={isLoading}
                    onChange={handleChange}
                    required
                />
                <div className="jn-py-2">
                    <ButtonRow name="Default ButtonRow" className="jn-justify-end">
                        <Button
                            label="Connect"
                            title="Connect"
                            variant="primary"
                            type="submit"
                            onClick={onSubmit}
                        />
                    </ButtonRow>
                </div>
            </Form>
        </Modal>
    )
}

export default LogInModal
