import { Paragraph, Text } from "evergreen-ui";
import React from "react";
import fastDiff from "fast-diff";

interface TextDiffProps {
  from?: string;
  to: string;
}

function TextDiff({ from, to }: TextDiffProps) {
  const diffStr = (from && fastDiff(from, to)) || [];

  return (
    <Paragraph>
      {diffStr.length > 1 ? (
        <>
          <Text>
            {diffStr.map((diff, index) => {
              const [operation, text] = diff;
              switch (operation) {
                case fastDiff.DELETE:
                  return (
                    <Text
                      is="del"
                      fontWeight="bold"
                      key={index}
                      {...(diffStr[index + 1]?.[0] === fastDiff.INSERT
                        ? { marginRight: 4 }
                        : {})}
                    >
                      {text}
                    </Text>
                  );
                case fastDiff.INSERT:
                  return (
                    <Text
                      is="ins"
                      fontWeight="bold"
                      key={index}
                      {...(diffStr[index + 1]?.[0] === fastDiff.DELETE
                        ? { marginRight: 4 }
                        : {})}
                    >
                      {text}
                    </Text>
                  );
                default:
                  return <Text key={index}>{text}</Text>;
              }
            })}
          </Text>
        </>
      ) : (
        <Text>{to}</Text>
      )}
    </Paragraph>
  );
}

export default TextDiff;
