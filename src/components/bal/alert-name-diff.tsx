import { Pane, Text } from "evergreen-ui";
import fastDiff from "fast-diff";

interface AlertNameDiffProps {
  fieldLabel: string;
  currentName: string;
  suggestedName: string;
}

function AlertNameDiff({
  fieldLabel,
  currentName,
  suggestedName,
}: AlertNameDiffProps) {
  const diffStr = fastDiff(currentName, suggestedName);

  return (
    <Pane>
      <Text size={300} fontWeight={600} display="block" marginBottom={8}>
        {fieldLabel}
      </Text>
      <Pane marginBottom={8}>
        <Text size={300} color="muted">
          Actuel :
        </Text>
        <Pane
          marginTop={4}
          padding={8}
          background="tint1"
          borderRadius={4}
        >
          <Text>
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
      <Pane>
        <Text size={300} color="muted">
          Suggestion :
        </Text>
        <Pane
          marginTop={4}
          padding={8}
          background="tint1"
          borderRadius={4}
        >
          <Text>
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
  );
}

export default AlertNameDiff;
