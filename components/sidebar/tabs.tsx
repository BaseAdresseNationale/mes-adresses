import React, { useContext } from "react";
import { Pane, Tablist, Tab } from "evergreen-ui";
import Link from "next/link";

import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";
import TokenContext from "@/contexts/token";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
  SIGNALEMENTS = "signalements",
}

interface TabsSideBarProps {
  balId: string;
}

function TabsSideBar({ balId }: TabsSideBarProps) {
  const { selectedTab } = useContext(LayoutContext);
  const { pendingSignalementsCount, archivedSignalementsCount } =
    useContext(SignalementContext);
  const communeHasSignalements =
    pendingSignalementsCount > 0 || archivedSignalementsCount > 0;
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);

  return (
    <>
      <Pane
        flexShrink={0}
        elevation={0}
        width="100%"
        display="flex"
        padding={10}
      >
        <Tablist>
          {[
            {
              key: TabsEnum.COMMUNE,
              label: "Commune",
              href: `/bal/${balId}`,
            },
            {
              key: TabsEnum.VOIES,
              label: "Voies",
              href: `/bal/${balId}/${TabsEnum.VOIES}`,
            },
            {
              key: TabsEnum.TOPONYMES,
              label: "Toponymes",
              href: `/bal/${balId}/${TabsEnum.TOPONYMES}`,
            },
            {
              key: TabsEnum.SIGNALEMENTS,
              label: "Signalements",
              notif: pendingSignalementsCount,
              href: `/bal/${balId}/${TabsEnum.SIGNALEMENTS}`,
              isHidden: !isAdmin || !communeHasSignalements,
            },
          ]
            .filter(({ isHidden }) => !isHidden)
            .map(({ label, notif, key, href }, index) => {
              const tab = (
                <Link href={href} key={key} shallow style={{ margin: "0 5px" }}>
                  <Tab
                    key={key}
                    position="relative"
                    isSelected={selectedTab ? selectedTab === key : index === 0}
                  >
                    {label}
                    {notif > 0 && <span className="tab-notif">{notif}</span>}
                  </Tab>
                </Link>
              );
              return tab;
            })}
        </Tablist>
      </Pane>
      <style jsx>{`
        .tab {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: whitesmoke;
        }

        .tab:hover {
          cursor: pointer;
          background: #e4e7eb;
        }

        .tab.selected {
          background: #fff;
        }

        .tab .selected:hover {
          background: #e4e7eb;
        }

        .tab-notif {
          position: absolute;
          top: -10px;
          right: -5px;
          background: red;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 50%;
        }
      `}</style>
    </>
  );
}
export default TabsSideBar;
