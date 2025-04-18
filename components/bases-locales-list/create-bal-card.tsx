import React from "react";
import { Card, Icon, Pane, PlusIcon, Text } from "evergreen-ui";
import NextLink from "next/link";
import styled from "styled-components";

export const StyledCard = styled(Card)`
  --bg-color: #3366ff;
  --bg-color-light: #85a3ff;
  --text-color-hover: white;

  border-top-right-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.3s ease-out;
  text-decoration: none;

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

  &:hover .card-title {
    color: var(--text-color-hover);
  }

  &:active {
    transform: scale(1) translateZ(0);
    box-shadow:
      0 15px 24px rgba(0, 0, 0, 0.11),
      0 15px 24px var(--box-shadow-color);
  }

  .circle {
    width: 131px;
    height: 131px;
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
      width: 118px;
      height: 118px;
      display: block;
      position: absolute;
      background: var(--bg-color);
      border-radius: 50%;
      top: 7px;
      left: 7px;
      transition: opacity 0.3s ease-out;
    }

    svg {
      z-index: 10000;
      transform: translateZ(0);
    }
  }

  .overlay {
    width: 120px;
    position: absolute;
    height: 120px;
    border-radius: 50%;
    background: var(--bg-color);
    top: 120px;
    left: 84px;
    z-index: 0;
    transition: transform 0.3s ease-out;
  }
`;

function CreateBaseLocaleCard() {
  return (
    <StyledCard
      flexShrink={0}
      width={290}
      height={400}
      border
      elevation={2}
      margin={12}
      is={NextLink}
      href="/new"
      title="Ajouter une Base Adresse Locale"
    >
      <div className="overlay" />
      <div className="circle">
        <Icon icon={PlusIcon} size={40} color="white" />
      </div>
      <Pane marginTop={20} textAlign="center" zIndex={1}>
        <Text fontSize={18} fontWeight={500} className="card-title">
          Ajouter une Base Adresse Locale
        </Text>
      </Pane>
    </StyledCard>
  );
}

export default CreateBaseLocaleCard;
