import { create } from "zustand"

const ACTIONS = {
  SIGN_ON: "signOn",
  SIGN_OUT: "signOut",
}

const createAuthDataSlice = (set, get) => ({
  auth: {
    data: null,
    isProcessing: false,
    loggedIn: false,
    error: null,
    lastAction: {},
    appLoaded: false,
    appIsLoading: false,

    actions: {
      setAppLoaded: (appLoaded) => {
        set(
          (state) => ({ auth: { ...state.auth, appLoaded } }),
          false,
          "auth/setAppLoaded"
        )
      },
      setData: (data) => {
        set(
          (state) => ({
            auth: {
              ...state.auth,
              isProcessing: data.isProcessing,
              loggedIn: data.loggedIn,
              error: data.error,
              data: data.auth,
            },
          }),
          false,
          "auth/setData"
        )
      },
      setAction: (name) =>
        set(
          (state) => ({
            auth: {
              ...state.auth,
              lastAction: { name: name, updatedAt: Date.now() },
            },
          }),
          false,
          "auth/setAction"
        ),
      login: () => get().auth.setAction(ACTIONS.SIGN_ON),
      logout: () => get().auth.setAction(ACTIONS.SIGN_OUT),
    },
  },
})

const createAppsDataSlice = (set, get) => ({
  apps: {
    active: [],
    config: {},
    actions: {
      setActive: (active) =>
        set(
          (state) => {
            if (!Array.isArray(active)) active = [active]
            return { apps: { ...state.apps, active } }
          },
          false,
          "apps/setActive"
        ),
      addActive: (appName) =>
        set(
          (state) => {
            const index = state.apps.active.findInde((i) => i === appName)
            if (index >= 0) return state
            const newActive = state.apps.active.slice()
            newActive.push(appName)
            return { apps: { ...state.apps, active: newActive } }
          },
          false,
          "apps/addActive"
        ),
      removeActive: (appName) =>
        set(
          (state) => {
            const index = state.apps.active.findInde((i) => i === appName)
            if (index < 0) return state
            let newActive = state.apps.active.slice()
            newActive.splice(index, 1)
            return { apps: { ...state.apps, active: newActive } }
          },
          false,
          "apps/removeActive"
        ),
      setConfig: (config) =>
        set(
          (state) => ({ apps: { ...state.apps, config } }),
          false,
          "apps/setConfig"
        ),
    },
  },
})
// global zustand store. See how this works here: https://github.com/pmndrs/zustand
const useStore = create((set, get) => ({
  ...createAuthDataSlice(set, get),
  ...createAppsDataSlice(set, get),
  apiEndpoint: "",
  assetsHost: "",

  actions: {
    setApiEndpoint: (value) =>
      set(() => ({ apiEndpoint: value }), false, "setApiEndpoint"),
    setAssetsHost: (value) =>
      set(() => ({ assetsHost: value }), false, "setAssetsHost"),
  },
}))

// AUTH
export const useAuthData = () => useStore((s) => s.auth.data)
export const useAuthIsProcessing = () => useStore((s) => s.auth.isProcessing)
export const useAuthLoggedIn = () => useStore((s) => s.auth.loggedIn)
export const useAuthError = () => useStore((s) => s.auth.error)
export const useAuthLastAction = () => useStore((s) => s.auth.lastAction)
export const useAuthAppLoaded = () => useStore((s) => s.auth.appLoaded)
export const useAuthAppIsLoading = () => useStore((s) => s.auth.appIsLoading)
export const useAuthActions = () => useStore((s) => s.auth.actions)

// APPS
export const useApiEndpoint = () => useStore((s) => s.apiEndpoint)
export const useAssetsHost = () => useStore((s) => s.assetsHost)
export const useActions = () => useStore((s) => s.actions)

// GLOBAL
export const useAppsActive = () => useStore((s) => s.apps.active)
export const useAppsConfig = () => useStore((s) => s.apps.config)
export const useAppsActions = () => useStore((s) => s.apps.actions)
