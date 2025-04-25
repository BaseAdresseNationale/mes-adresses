import { Button, Heading, Pane, Text } from "evergreen-ui";
import styles from "./stepper.module.css";

interface StepperProps {
  steps: { label: string; canBrowseNext: boolean; canBrowseBack: boolean }[];
  currentStepIndex: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
}

function Stepper({
  steps,
  currentStepIndex,
  onStepChange,
  children,
}: StepperProps) {
  return (
    <Pane className={styles.stepper}>
      <Pane className={styles["stepper-header"]}>
        <Heading is="h2">
          {steps[currentStepIndex].label}
          <Text marginLeft={8} fontSize={12} color="muted">
            Étape {currentStepIndex + 1} sur {steps.length}
          </Text>
        </Heading>
        <Pane className={styles["stepper-steps"]}>
          {steps.map(({ label }, index) => (
            <div
              key={label}
              className={`${styles["stepper-step"]}${
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
      <Pane className={styles["stepper-content"]}>{children}</Pane>
      <Pane className={styles["stepper-controls"]}>
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
    </Pane>
  );
}

export default Stepper;
