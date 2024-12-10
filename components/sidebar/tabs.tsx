import React, { useContext, useMemo } from "react";
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
  selectedTab: TabsEnum;
  balId: string;
}

function TabsSideBar({ selectedTab, balId }: TabsSideBarProps) {
  const { isMobile } = useContext(LayoutContext);
  const { signalements } = useContext(SignalementContext);

  const urlByTab = useMemo(() => {
    return {
      commune: `/bal/${balId}`,
      voies: `/bal/${balId}?selectedTab=voies`,
      toponymes: `/bal/${balId}?selectedTab=toponymes`,
    };
  }, [balId]);

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
              notif: signalements.length,
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
            },
          ].map(({ label, notif, tooltip, key }) => {
            const tab = (
              <Link href={urlByTab[key]} shallow style={{ margin: "0 5px" }}>
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
