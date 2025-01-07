import BalDataContext from "@/contexts/bal-data";
import TokenContext from "@/contexts/token";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

interface MainProps {
  children: React.ReactNode;
}

function ProtectedPage({ children }: MainProps) {
  const { token, tokenIsChecking } = useContext(TokenContext);
  const { baseLocale } = useContext(BalDataContext);
  const router = useRouter();
  const isAdmin = Boolean(token);

  useEffect(() => {
    if (tokenIsChecking) {
      return;
    }

    if (!isAdmin) {
      router.push(`/bal/${baseLocale.id}`);
    }
  }, [isAdmin, router, tokenIsChecking, baseLocale]);

  return isAdmin && children;
}

export default ProtectedPage;
