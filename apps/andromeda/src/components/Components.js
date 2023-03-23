import React, {useMemo} from "react";

import {Button, Message, Spinner, Stack} from "juno-ui-components";

export const Error = ({error}) => {
    if (error) {
        return (
            <Message variant="error">
                {`${error.statusCode}, ${error.message}`}
            </Message>
        )
    }
}

export const Loading = ({isLoading}) => {
    if (isLoading) {
        return (
            <Stack className="ml-auto" alignment="center">
                <Spinner variant="primary"/>
                Loading...
            </Stack>
        )
    }
}

const avatarCss = `
h-8
w-8
bg-theme-background-lvl-2
rounded-full
mr-2
bg-cover 
`

export const HeaderUser = ({ auth, logout }) => {
    const sapID = useMemo(() => auth?.user.name || "", [auth])

    return (
        <Stack alignment="center" className="ml-auto" distribution="end">
            <div className="mr-4">
                <Stack alignment="center">
                    <div
                        style={{
                            background: `url(https://avatars.wdf.sap.corp/avatar/${sapID}?size=24x24) no-repeat`,
                            backgroundSize: `cover`,
                        }}
                        className={avatarCss}
                    />
                    {<span>{sapID}</span>}
                </Stack>
            </div>

            <Button
                label="Logout"
                size="small"
                onClick={logout}
            />
        </Stack>
    )
}
