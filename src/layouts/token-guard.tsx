"use client";

import LocalStorageContext from "@/contexts/local-storage";
import TokenContext from "@/contexts/token";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

interface TokenGuardProps {
  children: React.ReactNode;
  token: string;
  balId: string;
}

export default function TokenGuard({
  children,
  token,
  balId,
}: TokenGuardProps) {
  const { verifyToken } = useContext(TokenContext);
  const { addBalAccess } = useContext(LocalStorageContext);
  const router = useRouter();

  useEffect(() => {
    async function initialize() {
      await verifyToken(token);
      addBalAccess(balId, token);
      router.push(`/bal/${balId}`);
    }

    void initialize();
  }, [token, verifyToken, balId, addBalAccess, router]);

  return children;
}
