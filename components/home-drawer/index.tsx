import {
  DoubleChevronLeftIcon,
  DoubleChevronRightIcon,
  IconButton,
  Tab,
  Tablist,
} from "evergreen-ui";
import { useState } from "react";
import styled from "styled-components";

const TABS = ["Actualités", "Prochains webinaires", "Nos partenaires"];

interface HomeDrawerProps {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
  drawerWidth: number;
}

const StyledDrawer = styled.div<{ width: number; isExpanded: boolean }>`
  position: absolute;
  top: 0;
  right: ${(props) => (props.isExpanded ? 0 : -props.width)}px;
  height: 100%;
  margin-top: 1px;
  width: ${(props) => props.width}px;
  background: white;
  border-left: 1px solid #e4e7eb;
  transition: right 0.3s ease;
`;

function HomeDrawer({
  drawerWidth,
  isExpanded,
  setIsExpanded,
}: HomeDrawerProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <StyledDrawer width={drawerWidth} isExpanded={isExpanded}>
      <IconButton
        position="absolute"
        top={-2}
        left={-32}
        icon={isExpanded ? DoubleChevronRightIcon : DoubleChevronLeftIcon}
        onClick={() => setIsExpanded(!isExpanded)}
        appearance="minimal"
        background="white"
        borderBottom="1px solid #E4E7EB"
        borderLeft="1px solid #E4E7EB"
        borderTop="1px solid #E4E7EB"
      />
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
    </StyledDrawer>
  );
}

export default HomeDrawer;
