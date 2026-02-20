import { ArrowRightIcon, Pane, Text } from "evergreen-ui";
import fastDiff from "fast-diff";
import { AlertBatchItem } from "./alerts-batch-processor";
import { AlertNumero } from "@/lib/alerts/alerts.types";

interface AlertNameDiffProps {
  fieldLabel: string;
  currentItem: AlertBatchItem;
  // currentName: string;
  // suggestedName: string;
  isNumeroSuffixeAlert?: boolean;
}

function AlertNameDiff({
  fieldLabel,
  currentItem,
  isNumeroSuffixeAlert = false,
}: AlertNameDiffProps) {
  const diffStr = fastDiff(
    currentItem.alert.value,
    currentItem.alert.remediation
  );

  return (
    <Pane>
      <Text size={300} fontWeight={600} display="block" marginBottom={8}>
        {fieldLabel}
      </Text>
      <Pane display="flex" justifyContent="left">
        <Pane marginBottom={8} minWidth="100px">
          <Text size={300} color="muted">
            Actuel :
          </Text>
          <Pane marginTop={4} padding={8} background="tint1" borderRadius={4}>
            <Text>
              {isNumeroSuffixeAlert
                ? `${(currentItem.alert as AlertNumero).numero} `
                : null}
              {diffStr.map((diff, index) => {
                const [operation, text] = diff;
                if (operation === fastDiff.DELETE) {
                  return (
                    <Text
                      is="del"
                      key={index}
                      fontWeight="bold"
                      backgroundColor="#F8E3DA"
                      color="#D14343"
                    >
                      {text}
                    </Text>
                  );
                }
                if (operation === fastDiff.EQUAL) {
                  return <Text key={index}>{text}</Text>;
                }
                return null;
              })}
            </Text>
          </Pane>
        </Pane>
        <Pane paddingLeft="16px" paddingRight="16px" paddingTop="32px">
          <ArrowRightIcon />
        </Pane>
        <Pane>
          <Text size={300} color="muted">
            Suggestion :
          </Text>
          <Pane marginTop={4} padding={8} background="tint1" borderRadius={4}>
            <Text>
              {isNumeroSuffixeAlert
                ? `${(currentItem.alert as AlertNumero).numero} `
                : null}
              {diffStr.map((diff, index) => {
                const [operation, text] = diff;
                if (operation === fastDiff.INSERT) {
                  return (
                    <Text
                      is="ins"
                      key={index}
                      fontWeight="bold"
                      backgroundColor="#D3F5F7"
                      color="#0F7B82"
                    >
                      {text}
                    </Text>
                  );
                }
                if (operation === fastDiff.EQUAL) {
                  return <Text key={index}>{text}</Text>;
                }
                return null;
              })}
            </Text>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
}

export default AlertNameDiff;
