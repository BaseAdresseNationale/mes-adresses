import { ApiBalAdminService } from "@/lib/bal-admin";
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
  Spinner,
  Text,
} from "evergreen-ui";
import { useEffect, useState } from "react";
import styled from "styled-components";

const StyledWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 0;
  margin: 0;

  > li {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid #ccc;

    &:last-child {
      border-bottom: none;
    }
  }
`;

function getUpcomingTrainings(allEvents: EventType[]) {
  const upcomingTrainings = allEvents
    .filter(({ date, endHour, type }) => {
      const [hour, minute] = endHour.split(":");
      const eventDate = new Date(date);
      eventDate.setHours(parseInt(hour), parseInt(minute));

      return (
        eventDate.getTime() >= Date.now() &&
        (type === EventTypeTypeEnum.FORMATION ||
          type === EventTypeTypeEnum.FORMATION_LVL2)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      return dateA.getTime() - dateB.getTime();
    }) as EventType[];

  return upcomingTrainings;
}

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

function TrainingTab() {
  const [nextTrainings, setNextTrainings] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNextTrainings = async () => {
      try {
        const events = await ApiBalAdminService.getEvents();
        setNextTrainings(getUpcomingTrainings(events));
      } catch (error) {
        console.error("Error fetching next trainings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchNextTrainings();
  }, []);

  console.log("nextTrainings", nextTrainings);

  return isLoading ? (
    <Pane display="flex" alignItems="center" justifyContent="center" flex={1}>
      <Spinner />
    </Pane>
  ) : (
    <StyledWrapper>
      {nextTrainings.map(
        ({ id, type, date, startHour, endHour, description }) => (
          <Pane
            key={id}
            is="li"
            display="flex"
            flexDirection="column"
            padding={10}
            gap={8}
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
      <Button
        is="a"
        iconAfter={ArrowRightIcon}
        href={`${process.env.NEXT_PUBLIC_ADRESSE_URL}/evenements`}
        target="_blank"
        rel="noopener noreferrer"
        alignSelf="center"
        width="fit-content"
        marginTop={10}
      >
        Voir tous nos évènements
      </Button>
    </StyledWrapper>
  );
}

export default TrainingTab;
