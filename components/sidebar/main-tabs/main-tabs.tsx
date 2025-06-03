import React, { useContext } from "react";
import { Pane, Pulsar, Text } from "evergreen-ui";
import Link from "next/link";
import styles from "./main-tabs.module.css";
import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";
import Image from "next/image";

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

  const isTabSelected = (tabKey: TabsEnum, index: number) => {
    return selectedTab ? selectedTab === tabKey : index === 0;
  };

  return (
    <Pane flexShrink={0} elevation={0} width="100%" display="flex" padding={10}>
      <div className={styles.tabsList}>
        {[
          {
            key: TabsEnum.COMMUNE,
            iconeUrl: "/static/images/icone-commune.png",
            label: "Commune",
            href: `/bal/${balId}`,
          },
          {
            key: TabsEnum.VOIES,
            iconeUrl: "/static/images/icone-voies.png",
            label: "Voies",
            href: `/bal/${balId}/${TabsEnum.VOIES}`,
          },
          {
            key: TabsEnum.TOPONYMES,
            iconeUrl: "/static/images/icone-toponymes.png",
            label: "Toponymes",
            href: `/bal/${balId}/${TabsEnum.TOPONYMES}`,
          },
          {
            key: TabsEnum.SIGNALEMENTS,
            iconeUrl: "/static/images/icone-signalements.png",
            label: "Signalements",
            notif: pendingSignalementsCount,
            href: `/bal/${balId}/${TabsEnum.SIGNALEMENTS}`,
            isHidden: !isAdmin || !communeHasSignalements,
          },
        ]
          .filter(({ isHidden }) => !isHidden)
          .map(({ label, notif, key, href, iconeUrl }, index) => {
            const isSelected = isTabSelected(key, index);
            const tab = (
              <Link className={styles.tabLink} href={href} key={key} shallow>
                <div
                  className={`${styles.tab}${
                    isSelected ? ` ${styles.selected}` : ""
                  }`}
                  key={key}
                >
                  <Image
                    className={styles.tabImage}
                    src={iconeUrl}
                    alt={label}
                    width={48}
                    height={60}
                  />
                  <Text
                    marginTop={8}
                    textDecoration="none"
                    {...(isSelected && { color: "blue500" })}
                  >
                    {label}
                  </Text>
                  {notif > 0 && <Pulsar size={16} right={0} top={0} />}
                </div>
              </Link>
            );
            return tab;
          })}
      </div>
    </Pane>
  );
}
export default MainTabs;
