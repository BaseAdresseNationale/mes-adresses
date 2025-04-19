import { Heading, Pane, Text } from "evergreen-ui";
import styled from "styled-components";

const StyledWrapper = styled.div`
  flex: 1;
  max-width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .illustration-wrapper {
    width: 50%;
    top: 0;
    left: 0;
    transform: translateX(50%) translateY(-100%);
    position: absolute;

    > .illustration {
      position: absolute;
      bottom: 0;
      left: calc(50% - 150px);
      transform: translateY(35%);
      background-image: url("/static/images/illustration-home.png");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 300px;
      height: 300px;
    }
  }

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

function WelcomeIllustration() {
  return (
    <StyledWrapper>
      <Pane
        padding={16}
        borderRadius={8}
        background="white"
        border="muted"
        elevation={1}
        position="relative"
        minWidth={360}
      >
        <div className="illustration-wrapper">
          <div className="illustration" />
        </div>

        <Heading is="h1" marginBottom={8}>
          Bienvenue sur mes-adresses!
        </Heading>
        <Text>
          Commencez à gérer vos adresses en créant une Base Adresse Locale
          (BAL).
        </Text>
      </Pane>
    </StyledWrapper>
  );
}

export default WelcomeIllustration;
