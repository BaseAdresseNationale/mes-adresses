import TokenContext from "@/contexts/token";
import { useContext, useEffect } from "react";
import BalDataContext from "@/contexts/bal-data";
import { useRouter } from "next/router";

interface MainProps {
  children: React.ReactNode;
}

function ProtectedPage({ children }: MainProps) {
  const router = useRouter();
  const { baseLocale } = useContext(BalDataContext);
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);

  // useEffect(() => {
  //   if (!isAdmin) {
  //     router.push(`/bal/${baseLocale._id}`);
  //   }
  // }, [isAdmin, router, baseLocale._id]);

  return isAdmin && children;
}

export default ProtectedPage;
