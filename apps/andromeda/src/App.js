import React from "react"

import {authStore, useStore} from "./store"
import StyleProvider, {AppShell, PageHeader} from "juno-ui-components"
import {QueryCache, QueryClient, QueryClientProvider} from '@tanstack/react-query'
import styles from "./styles.scss"
import AppContent from "./AppContent"
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import LogInModal from "./components/LogInModal";
import {HeaderUser} from "./components/Components";

const URL_STATE_KEY = "andromeda"

const App = (props) => {
    const setEndpoint = useStore((state) => state.setEndpoint)
    const setUrlStateKey = useStore((state) => state.setUrlStateKey)
    const [auth, setAuth] = authStore((state) => [state.auth, state.setAuth])
    const {embedded} = props

    // on app initial load save Endpoint and URL_STATE_KEY so it can be
    // used from overall in the application
    React.useEffect(() => {
        // set to empty string to fetch local test data in dev mode
        setEndpoint(props.endpoint || "v1")
        setUrlStateKey(URL_STATE_KEY)
    }, [])

    const logout = () => {
        setAuth(undefined)
        queryClient.invalidateQueries().then()
    }

    const pageHeader = React.useMemo(() => {
        return (
            <PageHeader heading="Converged Cloud | Andromeda">
                {auth && (
                    <HeaderUser auth={auth} logout={logout}/>
                )}
            </PageHeader>
        )
    }, [auth])

    // Create query client which it can be used from overall in the app
    const queryClient = new QueryClient({
        queryCache: new QueryCache({
            onError: (error) => {
                if (error?.statusCode === 401) {
                    // force re-authenticate
                    logout().then()
                }
            }
        }),
    })

    return (
        <QueryClientProvider client={queryClient}>
            <AppShell
                pageHeader={pageHeader}
                contentHeading="Global Load Balancing as a Service"
                embedded={embedded === "true"}
            >
                {auth ? (
                    <AppContent props={props}/>
                ) : (
                    <LogInModal/>
                )}
            </AppShell>
            <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

const StyledApp = (props) => {
    return (
        <StyleProvider
            stylesWrapper="shadowRoot"
            theme={`${props.theme ? props.theme : "theme-dark"}`}
        >
            {/* load styles inside the shadow dom */}
            <style>{styles.toString()}</style>
            <App {...props} />
        </StyleProvider>
    )
}
export default StyledApp
