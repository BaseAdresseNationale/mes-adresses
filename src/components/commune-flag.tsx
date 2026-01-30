"use client";

import { useEffect, useState } from "react";
import { getCommuneFlagProxy } from "@/lib/api-blason-commune";
import NextImage from "next/image";

function CommuneFlag({
  codeCommune,
  width = 100,
  height = 100,
}: {
  codeCommune: string;
  width?: number;
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
    <NextImage
      width={width}
      height={height}
      src={flag || "/static/images/mairie.svg"}
      alt="logo mairie"
    />
  );
}

export default CommuneFlag;
