import Image from "next/image";

interface ResponsiveImageProps extends React.ComponentProps<typeof Image> {
  orientation?: "portrait" | "landscape";
}

export default function ResponsiveImage({
  src,
  alt,
  style,
  orientation = "landscape",
  ...props
}: ResponsiveImageProps) {
  const orientationStyle =
    orientation === "portrait"
      ? { height: "100%", width: "auto" }
      : { width: "100%", height: "auto" };

  return (
    <Image
      loading="eager"
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ ...orientationStyle, ...style }}
      {...props}
    />
  );
}
