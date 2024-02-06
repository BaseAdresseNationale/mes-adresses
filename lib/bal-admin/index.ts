/* eslint no-restricted-imports: off */
import { BALWidgetConfig } from './type'

const NEXT_PUBLIC_BAL_ADMIN_URL =
  process.env.NEXT_PUBLIC_BAL_ADMIN_URL || "https://bal-admin.adresse.data.gouv.fr";

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

  
}






