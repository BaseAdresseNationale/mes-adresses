import React from "react";
import { Icon, IconComponent, Pane, Text } from "evergreen-ui";
import styled from "styled-components";

export const StyledButton = styled.button`
  --bg-color: #3366ff;
  --bg-color-light: #85a3ff;
  --text-color-hover: white;

  overflow: hidden;
  flex: 1;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease-out;
  text-decoration: none;
  border: none;
  background-color: transparent;

  &:hover .overlay {
    transform: scale(5) translateZ(0);
  }

  &:hover .circle {
    border-color: var(--bg-color-light);
    background: var(--bg-color);
  }

  &:hover .circle:after {
    background: var(--bg-color-light);
  }

  &:hover .button-label {
    color: var(--text-color-hover);
  }

  .circle {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid var(--bg-color);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 1;
    transition: all 0.3s ease-out;

    &:after {
      content: "";
      width: 100px;
      height: 100px;
      display: block;
      position: absolute;
      background: var(--bg-color);
      border-radius: 50%;
      transition: opacity 0.3s ease-out;
    }

    svg {
      z-index: 10000;
      transform: translateZ(0);
    }
  }

  .overlay {
    width: 100px;
    height: 100px;
    position: absolute;
    border-radius: 50%;
    background: var(--bg-color);
    z-index: 0;
    transition: transform 0.3s ease-out;
  }
`;

interface ButtonCircleEffectProps {
  label: string;
  onClick: () => void;
  icon: IconComponent;
}

function ButtonCircleEffect({ label, onClick, icon }: ButtonCircleEffectProps) {
  return (
    <StyledButton onClick={onClick}>
      <Pane display="flex" justifyContent="center" alignItems="center">
        <div className="overlay" />
        <div className="circle">
          <Icon icon={icon} size={40} color="white" />
        </div>
      </Pane>
      <Pane marginTop={20} textAlign="center">
        <Text fontSize={18} fontWeight={500} className="button-label">
          {label}
        </Text>
      </Pane>
    </StyledButton>
  );
}

export default ButtonCircleEffect;
