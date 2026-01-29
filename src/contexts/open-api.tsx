"use client";

import { initialOpenAPIBaseURL } from "@/lib/open-api";
import { OpenAPI } from "@/lib/openapi-api-bal";
import { ChildrenProps } from "@/types/context";
import React, { useCallback, useEffect, useState } from "react";

interface OpenAPIContextType {
  assignBALToken: (token: string) => void;
}

const OpenAPIContext = React.createContext<OpenAPIContextType | null>(null);

export function OpenAPIContextProvider({ children }: ChildrenProps) {
  const [initialized, setInitialized] = useState(false);
  // Set OpenAPI BASE URLs on mount
  useEffect(() => {
    initialOpenAPIBaseURL();
    setInitialized(true);
  }, []);

  const assignBALToken = useCallback((token: string) => {
    Object.assign(OpenAPI, {
      TOKEN: token,
    });
  }, []);

  const value = {
    assignBALToken,
  };

  return (
    <OpenAPIContext.Provider value={value}>
      {initialized ? children : null}
    </OpenAPIContext.Provider>
  );
}

export const OpenAPIConsumer = OpenAPIContext.Consumer;

export default OpenAPIContext;
