import { EventType, EventTypeTypeEnum } from "@/lib/bal-admin/type";
import { getFullDate } from "@/lib/utils/date";
import {
  ArrowRightIcon,
  Badge,
  Button,
  CalendarIcon,
  Heading,
  Icon,
  Pane,
  Text,
} from "evergreen-ui";

const trainingTypeMap = {
  [EventTypeTypeEnum.FORMATION]: {
    color: "green",
    label: "Formation débutant",
  },
  [EventTypeTypeEnum.FORMATION_LVL2]: {
    color: "blue",
    label: "Formation avancée",
  },
};

interface TrainingTabProps {
  nextTrainings: EventType[];
}

function TrainingTab({ nextTrainings }: TrainingTabProps) {
  return (
    <Pane display="flex" flexDirection="column">
      {nextTrainings.length === 0 && (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          flex={1}
          padding={10}
        >
          <Text>Pas de formations à venir</Text>
        </Pane>
      )}
      <Pane is="ul" listStyle="none" padding={0} margin={0}>
        {nextTrainings.length > 0 &&
          nextTrainings.map(
            ({ id, type, date, startHour, endHour, description }, index) => (
              <Pane
                key={id}
                is="li"
                display="flex"
                flexDirection="column"
                padding={10}
                gap={8}
                justifyContent="space-between"
                borderBottom={
                  index === nextTrainings.length - 1 ? "none" : "1px solid #ccc"
                }
              >
                <Badge color={trainingTypeMap[type].color} width="fit-content">
                  {trainingTypeMap[type].label}
                </Badge>
                <Heading display="flex" alignItems="center" size={400}>
                  <Icon icon={CalendarIcon} marginRight={5} />
                  <span>{getFullDate(new Date(date))}</span>
                  <Pane marginX={5}>|</Pane>
                  <span>
                    {startHour} - {endHour}
                  </span>
                </Heading>
                <Text>{description}</Text>
                <Button
                  is="a"
                  iconAfter={ArrowRightIcon}
                  href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/formation-en-ligne#open-event-modal-${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  alignSelf="flex-end"
                  width="fit-content"
                >
                  S&apos;inscrire
                </Button>
              </Pane>
            )
          )}
      </Pane>
      <Button
        is="a"
        iconAfter={ArrowRightIcon}
        href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/evenements`}
        target="_blank"
        rel="noopener noreferrer"
        alignSelf="center"
        width="fit-content"
        margin={10}
      >
        Voir tous nos évènements
      </Button>
    </Pane>
  );
}

export default TrainingTab;
