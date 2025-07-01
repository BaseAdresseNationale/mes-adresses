import BaseLocalePage from "./index";
import { BasesLocalesService } from "@/lib/openapi-api-bal";

export async function getServerSideProps({ params }) {
  const { balId, token }: { balId: string; token: string } = params;

  try {
    const baseLocale = await BasesLocalesService.findBaseLocale(balId, true);

    return {
      props: {
        baseLocale,
        token,
      },
    };
  } catch {
    return {
      notFound: true,
    };
  }
}

export default BaseLocalePage;
