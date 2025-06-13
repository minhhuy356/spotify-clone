import { sendRequest } from "@/api/api";
import { api_albums, backendUrl, url_api_albums } from "@/api/url";
import { IAlbum } from "@/types/data";

export const findById = async (albumId: string) => {
  try {
    const res = await sendRequest<IBackendRes<IAlbum>>({
      url: `${backendUrl}${url_api_albums}${albumId}`,
      method: "GET",
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy album!");
  }
};

export const fetchAlbumRelated = async (releasedById: string) => {
  try {
    const res = await sendRequest<IBackendRes<IAlbum[]>>({
      url: `${backendUrl}${api_albums.related}${releasedById}`,
      method: "GET",
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy album!");
  }
};

export const album_service = {
  findById,
  fetchAlbumRelated,
};
