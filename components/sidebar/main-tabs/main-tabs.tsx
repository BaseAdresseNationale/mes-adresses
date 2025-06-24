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
import ResponsiveImage from "@/components/respponsive-image";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
  SIGNALEMENTS = "signalements",
}

const textExamples = {
  [TabsEnum.VOIES]: ["Rue Chaptal", "Rue du Bac", "Quai de Lot", "Le Voisinet"],
  [TabsEnum.TOPONYMES]: ["La butte", "Les loges", "Lambert", "Tartifume"],
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
            tooltip: "Informations générales sur cette Base Adresse Locale.",
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
            tooltip:
              "Liste des dénominations officielles auxquelles sont rattachés des numéros.",
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
            tooltip: "Liste des voies et lieux-dits qui ne sont pas numérotés.",
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
            tooltip: "Signalements reçus pour cette commune.",
          },
        ]
          .filter(({ isHidden }) => !isHidden)
          .map(({ notif, key, href, icon, tooltip }, index) => {
            const isSelected = isTabSelected(key, index);
            const tab = (
              <Tooltip key={key} content={tooltip}>
                <Link
                  className={styles.tabLink}
                  href={href}
                  shallow
                  draggable={false}
                  {...((key === TabsEnum.VOIES ||
                    key === TabsEnum.TOPONYMES) && {
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
              </Tooltip>
            );

            return tab;
          })}
      </div>
    </div>
  );
}
export default MainTabs;
