import React, { useContext } from "react";
import { Pane, Tablist, Tab, Tooltip } from "evergreen-ui";
import Link from "next/link";

import SignalementContext from "@/contexts/signalement";
import LayoutContext from "@/contexts/layout";

export enum TabsEnum {
  COMMUNE = "commune",
  VOIES = "voies",
  TOPONYMES = "toponymes",
}

interface TabsSideBarProps {
  balId: string;
}

function TabsSideBar({ balId }: TabsSideBarProps) {
  const { isMobile, selectedTab, setSelectedTab } = useContext(LayoutContext);
  const { pendingSignalementsCount } = useContext(SignalementContext);

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
              notif: pendingSignalementsCount,
              href: `/bal/${balId}?tab=${TabsEnum.COMMUNE}`,
            },
            {
              key: TabsEnum.VOIES,
              label: "Voies",
              tooltip: (
                <>
                  <p className="custom-tooltip-content">
                    Liste des dénominations officielles auxquelles sont
                    rattachés des numéros.
                  </p>
                  <p className="custom-tooltip-content">
                    Exemple :
                    <br /> 1 <b>Le Voisinet</b>, Breux-sur-Avre
                  </p>
                </>
              ),
              href: `/bal/${balId}?tab=${TabsEnum.VOIES}`,
            },
            {
              key: TabsEnum.TOPONYMES,
              label: "Toponymes",
              tooltip: (
                <>
                  <p className="custom-tooltip-content">
                    Liste des voies et lieux-dits qui ne sont pas numérotés.
                  </p>
                  <p className="custom-tooltip-content">
                    Exemple :
                    <br /> 1 Chemin de Boël, <b>Le Voisinet</b>, Breux-sur-Avre
                  </p>
                </>
              ),
              href: `/bal/${balId}?tab=${TabsEnum.TOPONYMES}`,
            },
          ].map(({ label, notif, tooltip, key, href }) => {
            const tab = (
              <Link
                href={href}
                key={key}
                shallow
                style={{ margin: "0 5px" }}
                replace={true}
                onClick={() => setSelectedTab(key)}
              >
                <Tab
                  key={key}
                  position="relative"
                  isSelected={selectedTab === key}
                >
                  {label}
                  {notif > 0 && <span className="tab-notif">{notif}</span>}
                </Tab>
              </Link>
            );
            return !isMobile && tooltip ? (
              <Tooltip
                content={tooltip}
                key={label}
                position="top-left"
                showDelay={500}
              >
                {tab}
              </Tooltip>
            ) : (
              tab
            );
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
