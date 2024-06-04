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
import { ApiGeoService } from "@/lib/geo-api";
import { CommuneType } from "@/types/commune";
import {
  BaseLocale,
  BasesLocalesService,
  CommuneExtraDTO,
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi";
import { CommuneApiGeoType } from "@/lib/geo-api/type";
import { MobileControls } from "@/components/mobile-layout/mobile-controls";
import LayoutContext from "@/contexts/layout";

interface EditorProps {
  children: React.ReactNode;
  commune: CommuneType;
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
  commune: CommuneType;
  voies: ExtendedVoieDTO[];
  toponymes: ExtentedToponymeDTO[];
}

export async function getBaseEditorProps(
  balId: string
): Promise<BaseEditorProps> {
  const baseLocale: ExtendedBaseLocaleDTO =
    await BasesLocalesService.findBaseLocale(balId);

  const communeExtras: CommuneExtraDTO = await CommuneService.findCommune(
    baseLocale.commune
  );
  const geoCommune: CommuneApiGeoType = await ApiGeoService.getCommune(
    baseLocale.commune,
    {
      fields: "contour",
    }
  );

  const commune: CommuneType = { ...geoCommune, ...communeExtras };
  const voies: ExtendedVoieDTO[] =
    await BasesLocalesService.findBaseLocaleVoies(balId);
  const toponymes: ExtentedToponymeDTO[] =
    await BasesLocalesService.findBaseLocaleToponymes(balId);

  return {
    baseLocale,
    commune,
    voies,
    toponymes,
  };
}

export default Editor;
