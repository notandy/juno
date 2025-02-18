import React from "react"

import useStore from "./store"
import { AppShell, AppShellProvider } from "juno-ui-components"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import AppContent from "./AppContent"
import styles from "./styles.scss"
import { MessagesProvider } from "messages-provider"
import markdown from "github-markdown-css/github-markdown.css"
import markdownDark from "github-markdown-css/github-markdown-dark.css"
import markdownLight from "github-markdown-css/github-markdown-light.css"
import CustomPageHeader from "./components/CustomPageHeader"

const URL_STATE_KEY = "assets-overview"

const App = (props = {}) => {
  const setManifestUrl = useStore((state) => state.setManifestUrl)
  const setUrlStateKey = useStore((state) => state.setUrlStateKey)

  // Create query client which it can be used from overall in the app
  const queryClient = new QueryClient()

  const embedded = props.embedded === "true" || props.embedded === true

  // on app initial load save Endpoint and URL_STATE_KEY so it can be
  // used from overall in the application
  React.useEffect(() => {
    // default is /manifest.json
    let manifestUrl = props.manifestUrl || "/manifest.json"
    // if manifestUrl does not start with http use current origin as prefix
    if (manifestUrl.indexOf("http") < 0) {
      // ensure first char is a "/"
      if (manifestUrl[0] !== "/") manifestUrl = "/" + manifestUrl
      manifestUrl = window.location.origin + manifestUrl
    }
    setManifestUrl(manifestUrl)
    setUrlStateKey(URL_STATE_KEY)
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppShell pageHeader={CustomPageHeader} embedded={embedded}>
        <MessagesProvider>
          <AppContent props={props} />
        </MessagesProvider>
      </AppShell>
    </QueryClientProvider>
  )
}

const StyledApp = (props) => {
  const theme = props.theme ? props.theme : "theme-dark"
  return (
    <AppShellProvider>
      {/* load styles inside the shadow dom */}
      <style>{styles.toString()}</style>
      <style>{markdown.toString()}</style>
      <style>
        {theme === "theme-dark"
          ? markdownDark.toString()
          : markdownLight.toString()}
      </style>
      <App {...props} />
    </AppShellProvider>
  )
}

export default StyledApp
