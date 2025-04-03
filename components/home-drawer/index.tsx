import { Tab, Tablist } from "evergreen-ui";
import { useState } from "react";
import styled from "styled-components";
import TrainingTab from "./training-tab";
import NewsTab from "./news-tab";

const TABS = ["Prochaines formations", "Actualités"];

const StyledDrawer = styled.div`
  height: 100%;
  width: 410px;
  background: white;
  border-left: 1px solid #e4e7eb;
  transition: right 0.3s ease;
  overflow: auto;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

function HomeDrawer() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <StyledDrawer>
      <Tablist padding={8}>
        {TABS.map((tab, index) => (
          <Tab
            key={tab}
            isSelected={selectedIndex === index}
            onSelect={() => setSelectedIndex(index)}
          >
            {tab}
          </Tab>
        ))}
      </Tablist>
      {selectedIndex === 0 && <TrainingTab />}
      {selectedIndex === 1 && <NewsTab />}
    </StyledDrawer>
  );
}

export default HomeDrawer;
