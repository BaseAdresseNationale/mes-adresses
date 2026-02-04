import {
  useState,
  useCallback,
  useEffect,
  useRef,
  SetStateAction,
  Dispatch,
  useMemo,
} from "react";
import {
  Button,
  Alert as AlertEvergreen,
  Text,
  UnorderedList,
  ListItem,
  defaultTheme,
} from "evergreen-ui";

import {
  AlertModelEnum,
  Alert,
  isAlertCodeVoieEnum,
  isAlertCodeNumeroEnum,
  AlertFieldEnum,
  AlertCodeEnum,
} from "@/lib/alerts/alerts.types";
import {
  AlertNumeroDefinitions,
  AlertVoieDefinitions,
} from "@/lib/alerts/alerts.definitions";

interface VoieEditorProps {
  value?: any;
  setValue: Dispatch<SetStateAction<any>>;
  validation: (value: string) => [codes: AlertCodeEnum[], remediation?: string];
  model: AlertModelEnum;
  field: AlertFieldEnum;
  hasDefinition?: boolean;
}

function AlertEditor({
  value,
  setValue,
  validation,
  model,
  field,
  hasDefinition = true,
}: VoieEditorProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [alert, setAlert] = useState<Alert | null>(null);

  const alertDefinition = useMemo(() => {
    return (
      alert?.codes.map((code) => {
        if (isAlertCodeVoieEnum(code)) {
          return AlertVoieDefinitions[code];
        } else if (isAlertCodeNumeroEnum(code)) {
          return AlertNumeroDefinitions[code];
        }
      }) || []
    );
  }, [alert]);

  const handleCorrection = useCallback(
    (value: string) => {
      setValue({ target: { value } });
      setAlert(null);
    },
    [setValue, setAlert]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const [codes, remediation] = validation(value);
      if (codes.length > 0) {
        setAlert({
          model,
          field,
          codes,
          value,
          remediation,
        });
      } else {
        setAlert(null);
      }
    }, 500);
  }, [value, validation, model, field]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {alert && (
        <AlertEvergreen
          intent="warning"
          marginTop={8}
          hasIcon={false}
          padding={8}
        >
          {hasDefinition ? (
            <UnorderedList>
              {alertDefinition.map((def) => (
                <ListItem key={def} color={defaultTheme.colors.yellow800}>
                  {def}
                </ListItem>
              ))}
            </UnorderedList>
          ) : null}
          {alert.remediation && (
            <Text color={defaultTheme.colors.yellow800}>
              Corriger en
              <Button
                marginLeft={8}
                intent="primary"
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  handleCorrection(alert.remediation);
                }}
              >
                {alert.remediation}
              </Button>
            </Text>
          )}
        </AlertEvergreen>
      )}
    </>
  );
}

export default AlertEditor;
