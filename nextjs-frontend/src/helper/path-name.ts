import { TTypeAlbum } from "@/lib/features/scroll-center/scroll-center.slice";

export const extractAlbumTypeFromPath = (
  pathName: string
): TTypeAlbum | null => {
  const segments = pathName.split("/").filter(Boolean);
  let lastSegment = segments[segments.length - 1];

  if (lastSegment === "discography") {
    lastSegment = "all";
  }

  const isValidType = (val: string): val is TTypeAlbum =>
    ["album", "single", "ep", "all"].includes(val);

  return isValidType(lastSegment) ? lastSegment : null;
};
