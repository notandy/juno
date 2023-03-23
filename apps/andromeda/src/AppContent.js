import React, {useEffect, useState} from "react"

import {Container, IntroBox, MainTabs, Tab, TabList, TabPanel,} from "juno-ui-components"
import {useStore} from "./store"
import {addOnChangeListener, currentState, push} from "url-state-provider"
import ModalManager from "./components/ModalManager"
import PanelManager from "./components/PanelManager"
import DomainList from "./components/Domains/DomainList"
import DatacenterList from "./components/Datacenters/DatacenterList";
import PoolList from "./components/Pools/PoolList";

const AppContent = (props) => {
  const urlStateKey = useStore((state) => state.urlStateKey)
  const [currentPanel, setCurrentPanel] = useState(null)
  const [currentModal, setCurrentModal] = useState(null)
  const [tabIndex, setTabIndex] = useState(0)

  // wait until the global state is set to fetch the url state
  useEffect(() => {
    const urlState = currentState(urlStateKey)
    setCurrentPanel(urlState?.currentPanel)
    setCurrentModal(urlState?.currentModal)
    if (urlState?.tabIndex) setTabIndex(urlState?.tabIndex)
  }, [urlStateKey])

  // this listener reacts on any change on the url state
  addOnChangeListener(urlStateKey, (newState) => {
    setCurrentPanel(newState?.currentPanel)
    setCurrentModal(newState?.currentModal)
  })

  const onTabSelected = (index) => {
    setTabIndex(index)
    const urlState = currentState(urlStateKey)
    push(urlStateKey, { ...urlState, tabIndex: index })
  }

  const closePanel = () => {
    const urlState = currentState(urlStateKey)
    push(urlStateKey, { ...urlState, currentPanel: "" })
  }

  return (
    <>
      <MainTabs selectedIndex={tabIndex} onSelect={onTabSelected}>
        <PanelManager currentPanel={currentPanel} closePanel={closePanel} />

        <TabList>
          <Tab>Domains</Tab>
          <Tab>Pools</Tab>
          <Tab>Datacenters</Tab>
        </TabList>

        <TabPanel>
          {/* You'll normally want to use a Container as a wrapper for your content because it has padding that makes everything look nice */}
          <Container py>
            <IntroBox>
              Andromeda is in BETA, please report bugs
            </IntroBox>

            {/* Render List of Peaks: */}
            <DomainList />
          </Container>
        </TabPanel>
        <TabPanel>
          <Container py>
            <PoolList />

          </Container>
        </TabPanel>
        <TabPanel>
          <Container py>
            <DatacenterList />

          </Container>
        </TabPanel>
      </MainTabs>
      <ModalManager currentModal={currentModal} />
    </>
  )
}

export default AppContent
