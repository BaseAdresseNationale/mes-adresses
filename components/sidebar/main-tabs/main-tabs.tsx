import React, { useContext, useState } from "react";
import { Pane, Pulsar, Tooltip } from "evergreen-ui";
import Link from "next/link";
import styles from "./main-tabs.module.css";
import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";
import BalDataContext from "@/contexts/bal-data";
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";
import DynamicTextIcon from "./dynamic-text-icon/dynamic-text-icon";
import ResponsiveImage from "@/components/responsive-image";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
  SIGNALEMENTS = "signalements",
}

const textExamples = {
  [TabsEnum.VOIES]: ["Rue Chaptal", "Rue du Bac", "Quai de Lot", "Le Voisinet"],
  [TabsEnum.TOPONYMES]: ["La Butte", "Les Loges", "Lambert", "Tartifume"],
};

interface MainTabsProps {
  balId: string;
}

function MainTabs({ balId }: MainTabsProps) {
  const { selectedTab } = useContext(LayoutContext);
  const { pendingSignalementsCount, archivedSignalementsCount } =
    useContext(SignalementContext);
  const communeHasSignalements =
    pendingSignalementsCount > 0 || archivedSignalementsCount > 0;
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);
  const { isEditing } = useContext(BalDataContext);
  const { savedSearchPagination } = useContext(SearchPaginationContext);
  const [selectedTextIndexes, setSelectedTextIndexes] = useState({
    [TabsEnum.VOIES]: 0,
    [TabsEnum.TOPONYMES]: 0,
  });

  const isTabSelected = (tabKey: TabsEnum, index: number) => {
    return selectedTab ? selectedTab === tabKey : index === 0;
  };

  return (
    <div className={`${styles.mainTabs}${isEditing ? ` ${styles.hide}` : ""}`}>
      <div className={styles.tabsList} role="tablist">
        {[
          {
            key: TabsEnum.COMMUNE,
            icon: (
              <div className={styles.tabImage}>
                <ResponsiveImage
                  src="/static/images/icone-commune.png"
                  alt={`Illustration de l'onglet commune`}
                  draggable={false}
                  orientation="portrait"
                />
              </div>
            ),
            href: `/bal/${balId}`,
          },
          {
            key: TabsEnum.VOIES,
            icon: (
              <DynamicTextIcon
                selectedTextIndex={selectedTextIndexes[TabsEnum.VOIES]}
                className={styles.tabImage}
                texts={textExamples[TabsEnum.VOIES]}
              >
                <ResponsiveImage
                  src="/static/images/icone-voies.png"
                  alt={`Illustration de l'onglet voies`}
                  draggable={false}
                  orientation="portrait"
                />
              </DynamicTextIcon>
            ),
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.VOIES}`,
              savedSearchPagination[TabsEnum.VOIES]
            ),
          },
          {
            key: TabsEnum.TOPONYMES,
            icon: (
              <DynamicTextIcon
                selectedTextIndex={selectedTextIndexes[TabsEnum.TOPONYMES]}
                className={styles.tabImage}
                texts={textExamples[TabsEnum.TOPONYMES]}
              >
                <ResponsiveImage
                  src="/static/images/icone-toponymes.png"
                  alt={`Illustration de l'onglet toponymes`}
                  draggable={false}
                  orientation="portrait"
                />
              </DynamicTextIcon>
            ),
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.TOPONYMES}`,
              savedSearchPagination[TabsEnum.TOPONYMES]
            ),
          },
          {
            key: TabsEnum.SIGNALEMENTS,
            icon: (
              <div className={styles.tabImage}>
                <ResponsiveImage
                  className={styles.tabImage}
                  src="/static/images/icone-signalements.png"
                  alt={`Illustration de l'onglet signalements`}
                  draggable={false}
                  orientation="portrait"
                />
              </div>
            ),
            notif: pendingSignalementsCount,
            href: `/bal/${balId}/${TabsEnum.SIGNALEMENTS}`,
            isHidden: !isAdmin || !communeHasSignalements,
          },
        ]
          .filter(({ isHidden }) => !isHidden)
          .map(({ notif, key, href, icon }, index) => {
            const isSelected = isTabSelected(key, index);
            const tab = (
              <Link
                key={key}
                className={styles.tabLink}
                role="tab"
                href={href}
                shallow
                draggable={false}
                {...((key === TabsEnum.VOIES || key === TabsEnum.TOPONYMES) && {
                  onClick: () => {
                    setSelectedTextIndexes((prev) => ({
                      ...prev,
                      [key]:
                        prev[key] + 1 >= textExamples[key].length
                          ? 0
                          : prev[key] + 1,
                    }));
                  },
                })}
              >
                <Pane
                  className={`${styles.tab}${
                    isSelected ? ` ${styles.selected}` : ""
                  }`}
                  {...(isSelected && { elevation: 1 })}
                >
                  {icon}
                  {notif > 0 && <Pulsar size={16} right={0} top={0} />}
                </Pane>
              </Link>
            );

            return tab;
          })}
      </div>
    </div>
  );
}
export default MainTabs;
