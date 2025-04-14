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
import WelcomeMessage from "@/components/welcome-message";
import DrawerContent from "@/components/drawer-content";
import AddressEditor from "@/components/bal/address-editor";
import DemoWarning from "@/components/demo-warning";
import Overlay from "@/components/overlay";
import {
  BaseLocale,
  BasesLocalesService,
  CommuneDTO,
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import { MobileControls } from "@/components/mobile-layout/mobile-controls";
import LayoutContext from "@/contexts/layout";

interface EditorProps {
  children: React.ReactNode;
  baseLocale: any;
  commune: CommuneDTO;
}

function Editor({ children, commune }: EditorProps) {
  const { isMobile, isMapFullscreen, setIsMapFullscreen } =
    useContext(LayoutContext);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const { tokenIsChecking } = useContext(TokenContext);
  const { baseLocale } = useContext(BalDataContext);

  const isDemo = baseLocale.status === BaseLocale.status.DEMO;

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
              bottom={isDemo || isMobile ? 50 : 0}
              left={isMapFullscreen ? 0 : sidebarWidth}
              commune={commune}
              baseLocale={baseLocale}
              isAddressFormOpen={isAddressFormOpen}
              handleAddressForm={setIsAddressFormOpen}
            />

            <Sidebar
              size={sidebarWidth}
              top={isMobile ? 150 : 116}
              bottom={isDemo ? 50 : 0}
              isHidden={isMapFullscreen}
              elevation={2}
              background="tint2"
              display="flex"
              flexDirection="column"
              onToggle={setIsMapFullscreen}
            >
              <>
                <WelcomeMessage />

                {isAddressFormOpen ? (
                  <AddressEditor
                    commune={commune}
                    closeForm={() => {
                      setIsAddressFormOpen(false);
                    }}
                  />
                ) : (
                  children
                )}
              </>
            </Sidebar>
            {isMobile && (
              <MobileControls
                isDemo={isDemo}
                onToggle={setIsMapFullscreen}
                isMapFullscreen={isMapFullscreen}
              />
            )}
            {isDemo && (
              <DemoWarning baseLocale={baseLocale} communeName={commune.nom} />
            )}
          </ParcellesContextProvider>
        </MarkersContextProvider>
      </DrawContextProvider>
    </MapContextProvider>
  );
}

export interface BaseEditorProps {
  baseLocale: ExtendedBaseLocaleDTO;
  commune: CommuneDTO;
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
}

export async function getBaseEditorProps(
  balId: string
): Promise<BaseEditorProps> {
  const [baseLocale, voies, toponymes] = await Promise.all([
    BasesLocalesService.findBaseLocale(balId, true),
    BasesLocalesService.findBaseLocaleVoies(balId),
    BasesLocalesService.findBaseLocaleToponymes(balId),
  ]);

  const commune = await CommuneService.findCommune(baseLocale.commune);

  return {
    baseLocale,
    commune,
    voies,
    toponymes,
  };
}

export default Editor;
