import { OpenAPI } from "@/lib/openapi-api-bal";
import { OpenAPI as OpenAPISignalement } from "@/lib/openapi-signalement";

export const initialOpenAPIBaseURL = () => {
  const openAPIBase = (process.env.NEXT_PUBLIC_BAL_API_URL || "")
    .split("/")
    .slice(0, -1)
    .join("/");
  Object.assign(OpenAPI, { BASE: openAPIBase });

  Object.assign(OpenAPISignalement, {
    BASE: process.env.NEXT_PUBLIC_API_SIGNALEMENT,
  });
};
