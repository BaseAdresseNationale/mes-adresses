"use client";

import { useEffect, useState } from "react";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import ResponsiveImage from "./responsive-image";

function CommuneFlag({
  codeCommune,
  height = 100,
}: {
  codeCommune: string;
  height?: number;
}) {
  const [flag, setFlag] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommuneFlag = async () => {
      try {
        const flagUrl = await getCommuneFlagProxy(codeCommune);
        setFlag(flagUrl);
      } catch (err) {
        console.error("Error fetching commune flag", err);
        setFlag(null);
      }
    };

    fetchCommuneFlag();
  }, [codeCommune]);

  return (
    <ResponsiveImage
      height={height}
      src={flag || "/static/images/mairie.svg"}
      alt="logo mairie"
    />
  );
}

export default CommuneFlag;
