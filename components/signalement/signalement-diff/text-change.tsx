import { ArrowRightIcon, Pane, Paragraph, Text } from "evergreen-ui";
import React from "react";
import { signalementTypeMap } from "../signalement-type-badge";
import { Signalement } from "@/lib/openapi-signalement";

interface TextChangeProps {
  from?: string;
  to: string;
}

function TextChange({ from, to }: TextChangeProps) {
  const hasChanged = from !== undefined && from !== to;
  return (
    <Paragraph>
      {hasChanged ? (
        <Pane display="flex" alignItems="center">
          {from && (
            <>
              <Text
                is="del"
                fontWeight="bold"
                backgroundColor={
                  signalementTypeMap[Signalement.type.LOCATION_TO_DELETE]
                    .backgroundColor
                }
              >
                {from}
              </Text>
              <ArrowRightIcon marginX={8} />
            </>
          )}
          <Text
            is="ins"
            fontWeight="bold"
            backgroundColor={
              signalementTypeMap[Signalement.type.LOCATION_TO_CREATE]
                .backgroundColor
            }
          >
            {to}
          </Text>
        </Pane>
      ) : (
        <Text>{to}</Text>
      )}
    </Paragraph>
  );
}

export default TextChange;
