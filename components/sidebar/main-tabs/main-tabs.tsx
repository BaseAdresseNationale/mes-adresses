import React, { useContext } from "react";
import { Pane, Pulsar, Tooltip } from "evergreen-ui";
import Link from "next/link";
import styles from "./main-tabs.module.css";
import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";
import Image from "next/image";
import BalDataContext from "@/contexts/bal-data";
import SearchPaginationContext from "@/contexts/search-pagination";
import { getLinkWithPagination } from "@/hooks/search-pagination";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
  SIGNALEMENTS = "signalements",
}

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

  const isTabSelected = (tabKey: TabsEnum, index: number) => {
    return selectedTab ? selectedTab === tabKey : index === 0;
  };

  return (
    <div className={`${styles.mainTabs}${isEditing ? ` ${styles.hide}` : ""}`}>
      <div className={styles.tabsList}>
        {[
          {
            key: TabsEnum.COMMUNE,
            iconeUrl: "/static/images/icone-commune.png",
            label: "Commune",
            href: `/bal/${balId}`,
            tooltip: "Informations générales sur cette Base Adresse Locale.",
          },
          {
            key: TabsEnum.VOIES,
            iconeUrl: "/static/images/icone-voies.png",
            label: "Voies",
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.VOIES}`,
              savedSearchPagination[TabsEnum.VOIES]
            ),
            tooltip:
              "Liste des dénominations officielles auxquelles sont rattachés des numéros.",
          },
          {
            key: TabsEnum.TOPONYMES,
            iconeUrl: "/static/images/icone-toponymes.png",
            label: "Toponymes",
            href: getLinkWithPagination(
              `/bal/${balId}/${TabsEnum.TOPONYMES}`,
              savedSearchPagination[TabsEnum.TOPONYMES]
            ),
            tooltip: "Liste des voies et lieux-dits qui ne sont pas numérotés.",
          },
          {
            key: TabsEnum.SIGNALEMENTS,
            iconeUrl: "/static/images/icone-signalements.png",
            label: "Signalements",
            notif: pendingSignalementsCount,
            href: `/bal/${balId}/${TabsEnum.SIGNALEMENTS}`,
            isHidden: !isAdmin || !communeHasSignalements,
            tooltip: "Signalements reçus pour cette commune.",
          },
        ]
          .filter(({ isHidden }) => !isHidden)
          .map(({ label, notif, key, href, iconeUrl, tooltip }, index) => {
            const isSelected = isTabSelected(key, index);
            const tab = (
              <Tooltip key={key} content={tooltip}>
                <Link
                  className={styles.tabLink}
                  href={href}
                  shallow
                  draggable={false}
                >
                  <Pane
                    className={`${styles.tab}${
                      isSelected ? ` ${styles.selected}` : ""
                    }`}
                    {...(isSelected ? { elevation: 1 } : {})}
                  >
                    <Image
                      className={styles.tabImage}
                      src={iconeUrl}
                      alt={`Illustration de l'onglet ${label}`}
                      draggable={false}
                      width={48}
                      height={60}
                    />
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
