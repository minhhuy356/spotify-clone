export const convertTypeAlbum = (type: string) => {
  if (type === "ep") return "EP";
  if (type === "single") return "Đĩa đơn";
  if (type === "album") return "Album";
};
