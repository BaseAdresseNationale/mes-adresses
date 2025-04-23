import { Button, Heading, Pane, Text } from "evergreen-ui";
import styled from "styled-components";

interface StepperProps {
  steps: { label: string; canBrowseNext: boolean; canBrowseBack: boolean }[];
  currentStepIndex: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
}

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;

  .stepper-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-bottom: 1px solid #e6e8f0;
    flex-shrink: 0;
  }

  .stepper-steps {
    display: flex;
    gap: 0.5rem;

    .stepper-step {
      width: 100%;
      height: 4px;
      background-color: #e0e0e0;
      margin: 0.5rem 0;
      transition: background-color 0.3s ease;
    }
    .stepper-step.active {
      background-color: #3366ff;
    }
  }

  .stepper-content {
    padding: 0 1rem;
    background-color: #fff;
    border-radius: 8px;
    flex-grow: 1;
  }

  .stepper-controls {
    border-top: 1px solid #e6e8f0;
    background-color: #f9f9f9;
    border-radius: 8px;
    flex-shrink: 0;

    > div {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0 1rem 1rem;
      max-width: 50%;

      @media screen and (max-width: 768px) {
        max-width: unset;
        padding: 1rem;
      }
    }
  }
`;

function Stepper({
  steps,
  currentStepIndex,
  onStepChange,
  children,
}: StepperProps) {
  return (
    <StyledWrapper>
      <Pane className="stepper-header">
        <Heading is="h2">
          {steps[currentStepIndex].label}
          <Text marginLeft={8} fontSize={12} color="muted">
            Étape {currentStepIndex + 1} sur {steps.length}
          </Text>
        </Heading>
        <Pane className="stepper-steps">
          {steps.map(({ label }, index) => (
            <div
              key={label}
              className={`stepper-step${
                currentStepIndex >= index ? " active" : ""
              }`}
            />
          ))}
        </Pane>
        {currentStepIndex !== steps.length - 1 && (
          <Pane>
            <Text fontWeight="bold" color="muted">
              Étape suivante :
            </Text>{" "}
            <Text color="muted">{steps[currentStepIndex + 1].label}</Text>
          </Pane>
        )}
      </Pane>
      <Pane className="stepper-content">{children}</Pane>
      <Pane className="stepper-controls">
        <Pane>
          <Button
            onClick={() => onStepChange(currentStepIndex - 1)}
            disabled={!steps[currentStepIndex].canBrowseBack}
            type="button"
          >
            Précédent
          </Button>
          <Button
            appearance="primary"
            onClick={() => {
              if (currentStepIndex !== steps.length - 1) {
                onStepChange(currentStepIndex + 1);
              }
            }}
            disabled={!steps[currentStepIndex].canBrowseNext}
            type={currentStepIndex === steps.length - 1 ? "submit" : "button"}
          >
            {currentStepIndex === steps.length - 1 ? "Terminer" : "Suivant"}
          </Button>
        </Pane>
      </Pane>
    </StyledWrapper>
  );
}

export default Stepper;
