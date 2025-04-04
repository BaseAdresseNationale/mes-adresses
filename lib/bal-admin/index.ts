/* eslint no-restricted-imports: off */
import { BALWidgetConfig, EventType, EventTypeTypeEnum } from "./type";

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL ||
  "https://bal-admin.adresse.data.gouv.fr";

export class ApiBalAdminService {
  public static async getBALWidgetConfig(): Promise<BALWidgetConfig> {
    const response = await fetch(
      `${NEXT_PUBLIC_BAL_ADMIN_URL}/api/bal-widget/config`
    );
    if (!response.ok) {
      const body = await response.json();
      throw new Error(body.message);
    }

    const data: BALWidgetConfig = await response.json();

    return data;
  }

  public static async getEvents(): Promise<EventType[]> {
    const response = await fetch(`${NEXT_PUBLIC_BAL_ADMIN_URL}/api/events`);
    if (!response.ok) {
      throw new Error("Error while fetching bal events");
    }

    return response.json();
  }

  public static async fetchNextTrainings(): Promise<EventType[]> {
    const allEvents = await this.getEvents();

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
}
