import { BaseEditorProps, getBaseEditorProps } from "@/layouts/editor";
import BaseLocalePage from "./index";

export async function getServerSideProps({ params }) {
  const { balId, token }: { balId: string; token: string } = params;

  try {
    const { baseLocale, commune, voies, toponymes }: BaseEditorProps =
      await getBaseEditorProps(balId);

    return {
      props: {
        baseLocale,
        commune,
        voies,
        toponymes,
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
