import { sendRequest } from "@/api/api";
import { api_albums, backendUrl, url_api_albums } from "@/api/url";
import { TTypeAlbum } from "@/lib/features/scroll-center/scroll-center.slice";
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

export const fetchAlbumRelated = async (
  releasedById: string,
  query: {
    sort?: string;
    limit?: number;
    skip?: number;
    select?: string;
  } = {}
) => {
  try {
    const res = await sendRequest<IBackendRes<IAlbum[]>>({
      url: `${backendUrl}${api_albums.related}${releasedById}`,
      method: "GET",
      queryParams: query,
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy album!");
  }
};

export const fetchAlbumByReleasedBy = async (
  releasedById: string,
  query: {
    sort?: string;
    limit?: number;
    minScore?: number;
    maxScore?: number;
    type?: TTypeAlbum[];
  } = {}
) => {
  const queryParams: Record<string, any> = {
    ...query,
    type: query.type?.join(","),
  };
  try {
    const res = await sendRequest<IBackendRes<IAlbum[]>>({
      url: `${backendUrl}${api_albums.releasedBy}${releasedById}`,
      method: "GET",
      queryParams: queryParams,
    });
    console.log(res.data);
    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy album!");
  }
};

export const album_service = {
  findById,
  fetchAlbumRelated,
  fetchAlbumByReleasedBy,
};
