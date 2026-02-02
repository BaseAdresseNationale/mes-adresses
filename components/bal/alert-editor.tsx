import {
  useState,
  useCallback,
  useEffect,
  useRef,
  SetStateAction,
  Dispatch,
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
  AlertFieldVoieEnum,
  AlertModelEnum,
  AlertCodeVoieEnum,
  Alert,
} from "@/lib/alerts/alerts.types";
import { AlertVoieDefinitions } from "@/lib/alerts/alerts.definitions";
import { isAlertVoieNom } from "@/lib/alerts/utils/alerts-voies.utils";

interface VoieEditorProps {
  initialAlert?: Alert;
  value?: any;
  setValue: Dispatch<SetStateAction<any>>;
  validation: (
    value: string,
  ) => [codes: AlertCodeVoieEnum[], remediation?: string];
}

function AlertEditor({
  initialAlert,
  value,
  setValue,
  validation,
}: VoieEditorProps) {
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [alert, setAlert] = useState<Alert | null>(initialAlert || null);

  const handleCorrection = useCallback(
    (value: string) => {
      setValue({ target: { value } });
      setAlert(null);
    },
    [setValue, setAlert],
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const [codes, remediation] = validation(value);
      if (codes.length > 0) {
        setAlert({
          model: AlertModelEnum.VOIE,
          field: AlertFieldVoieEnum.VOIE_NOM,
          codes,
          value,
          remediation,
        });
      } else {
        setAlert(null);
      }
    }, 500);
  }, [value, validation]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {alert && isAlertVoieNom(alert) && (
        <AlertEvergreen
          intent="warning"
          marginTop={8}
          hasIcon={false}
          padding={8}
        >
          <UnorderedList>
            {alert.codes.map((code) => (
              <ListItem key={code} color={defaultTheme.colors.yellow800}>
                {AlertVoieDefinitions[code]}
              </ListItem>
            ))}
          </UnorderedList>
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
