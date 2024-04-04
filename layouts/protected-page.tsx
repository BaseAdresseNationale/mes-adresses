import TokenContext from "@/contexts/token";
import { useContext } from "react";

interface MainProps {
  children: React.ReactNode;
}

function ProtectedPage({ children }: MainProps) {
  const { token } = useContext(TokenContext);
  const isAdmin = Boolean(token);

  return isAdmin && children;
}

export default ProtectedPage;
