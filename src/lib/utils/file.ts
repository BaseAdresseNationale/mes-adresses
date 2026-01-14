export function getFileExtension(name: string): string {
  const pos = name.lastIndexOf(".");
  if (pos > 0) {
    return name.slice(pos + 1);
  }

  return null;
}
