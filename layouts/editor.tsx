import { useState, useContext } from "react";

import { DrawerContextProvider } from "@/contexts/drawer";
import { DrawContextProvider } from "@/contexts/draw";
import { MarkersContextProvider } from "@/contexts/markers";
import { MapContextProvider } from "@/contexts/map";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import { ParcellesContextProvider } from "@/contexts/parcelles";

import Sidebar from "@/layouts/sidebar";

import SubHeader from "@/components/sub-header";
import Map from "@/components/map";
import DrawerContent from "@/components/drawer-content";
import AddressEditor from "@/components/bal/address-editor";
import DemoWarning from "@/components/demo-warning";
import Overlay from "@/components/overlay";
import { BaseLocale } from "@/lib/openapi-api-bal";
import { MobileControls } from "@/components/mobile-layout/mobile-controls";
import LayoutContext from "@/contexts/layout";
import { Pane } from "evergreen-ui";
import MainTabs from "@/components/sidebar/main-tabs/main-tabs";
import ProductTours from "@/components/sidebar/product-tours";
import ReadonlyWarning from "@/components/read-only-warning";

interface EditorProps {
  children: React.ReactNode;
}

function Editor({ children }: EditorProps) {
  const { isMobile, isMapFullscreen, setIsMapFullscreen } =
    useContext(LayoutContext);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const { tokenIsChecking, token } = useContext(TokenContext);
  const { baseLocale, commune } = useContext(BalDataContext);

  const isDemo = baseLocale.status === BaseLocale.status.DEMO;
  const isReadonly = !Boolean(token);
  const sidebarWidth = isMobile ? window.innerWidth : 500;

  return (
    <MapContextProvider>
      <DrawContextProvider>
        <MarkersContextProvider>
          <ParcellesContextProvider>
            <BalDataContext.Consumer>
              {({ habilitationIsLoading }) =>
                (tokenIsChecking || habilitationIsLoading) && (
                  <Overlay text="Chargement de la Base Adresse Locale" />
                )
              }
            </BalDataContext.Consumer>

            <DrawerContextProvider>
              <DrawerContent />
              <SubHeader commune={commune} />
            </DrawerContextProvider>

            <Map
              top={isMobile ? 150 : 116}
              bottom={isDemo || isReadonly || isMobile ? 50 : 0}
              left={isMapFullscreen ? 0 : sidebarWidth}
              commune={commune}
              baseLocale={baseLocale}
              isAddressFormOpen={isAddressFormOpen}
              handleAddressForm={setIsAddressFormOpen}
            />

            <Sidebar
              size={sidebarWidth}
              top={isMobile ? 150 : 116}
              bottom={isDemo || isReadonly ? 50 : 0}
              isHidden={isMapFullscreen}
              elevation={2}
              background="tint2"
              display="flex"
              flexDirection="column"
              onToggle={setIsMapFullscreen}
            >
              <MainTabs balId={baseLocale.id} />

              {token && <ProductTours commune={commune} />}

              {isAddressFormOpen ? (
                <AddressEditor
                  commune={commune}
                  closeForm={() => {
                    setIsAddressFormOpen(false);
                  }}
                />
              ) : (
                <Pane
                  position="relative"
                  display="flex"
                  flexDirection="column"
                  height="100%"
                  width="100%"
                  overflow="hidden"
                >
                  {children}
                </Pane>
              )}
            </Sidebar>
            {isMobile && (
              <MobileControls
                isDemo={isDemo}
                onToggle={setIsMapFullscreen}
                isMapFullscreen={isMapFullscreen}
              />
            )}
            {isReadonly && <ReadonlyWarning />}
            {!isReadonly && isDemo && (
              <DemoWarning
                baseLocale={baseLocale}
                communeName={commune.nom}
                isReadonly={isReadonly}
              />
            )}
          </ParcellesContextProvider>
        </MarkersContextProvider>
      </DrawContextProvider>
    </MapContextProvider>
  );
}

export default Editor;
