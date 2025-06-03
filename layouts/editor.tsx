import { useState, useContext } from "react";
import bbox from "@turf/bbox";

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
  CommuneService,
  ExtendedBaseLocaleDTO,
  ExtendedVoieDTO,
  ExtentedToponymeDTO,
} from "@/lib/openapi-api-bal";
import { MobileControls } from "@/components/mobile-layout/mobile-controls";
import LayoutContext from "@/contexts/layout";
import { ApiGeoService } from "@/lib/geo-api";
import { CommuneType } from "@/types/commune";
import { Pane } from "evergreen-ui";
import MainTabs from "@/components/sidebar/main-tabs/main-tabs";

interface EditorProps {
  children: React.ReactNode;
  baseLocale: ExtendedBaseLocaleDTO;
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
              <MainTabs balId={baseLocale.id} />

              <WelcomeMessage />

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
  const [baseLocale, voies, toponymes] = await Promise.all([
    BasesLocalesService.findBaseLocale(balId, true),
    BasesLocalesService.findBaseLocaleVoies(balId),
    BasesLocalesService.findBaseLocaleToponymes(balId),
  ]);

  const commune: CommuneType = await CommuneService.findCommune(
    baseLocale.commune
  );
  try {
    const communeApiGeo = await ApiGeoService.getCommune(baseLocale.commune, {
      fields: "contour",
    });
    if (communeApiGeo.contour) {
      commune.bbox = bbox(communeApiGeo.contour);
    }
  } catch (e) {
    if (voies.length > 0) {
      const bboxs = voies.map(({ bbox }) => bbox);
      commune.bbox = [
        Math.min(...bboxs.map((b) => b[0])),
        Math.min(...bboxs.map((b) => b[1])),
        Math.max(...bboxs.map((b) => b[2])),
        Math.max(...bboxs.map((b) => b[3])),
      ];
    }
  }

  return {
    baseLocale,
    commune,
    voies,
    toponymes,
  };
}

export default Editor;
