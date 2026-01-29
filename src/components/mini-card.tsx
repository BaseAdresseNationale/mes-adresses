"use client";

import { useState } from "react";
import { Pane, Link, Paragraph, defaultTheme } from "evergreen-ui";

import NextImage from "next/image";

function MiniCard({
  img,
  message,
  href,
}: {
  img: string;
  message: string;
  href: string;
}) {
  const [hover, setHover] = useState(false);

  return (
    <Pane
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...(hover ? { elevation: 3 } : {})}
    >
      <Link
        href={href}
        target="_blank"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          alignItems: "center",
          border: `1px solid ${defaultTheme.colors.blue700}`,
          borderBottom: `3px solid ${defaultTheme.colors.blue700}`,
          padding: "8px",
          borderRadius: " 2px",
        }}
      >
        <NextImage
          src={img}
          alt="logo formations en ligne"
          width={64}
          height={64}
        />
        <Paragraph color={defaultTheme.colors.blue700}>{message}</Paragraph>
      </Link>
    </Pane>
  );
}

export default MiniCard;
