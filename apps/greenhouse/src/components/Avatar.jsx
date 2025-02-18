import React from "react"
import { Stack } from "juno-ui-components"

const avatarCss = `
h-8
w-8
bg-theme-background-lvl-2
rounded-full
bg-cover 
`

const Avatar = ({ userName, userID, url }) => {
  return (
    <Stack alignment="center">
      <div
        style={{
          background: `url(https://avatars.wdf.sap.corp/avatar/${userID}?size=24x24) no-repeat`,
          backgroundSize: `cover`,
        }}
        className={avatarCss}
      />
      {userName && <span>{userName}</span>}
    </Stack>
  )
}

export default Avatar
