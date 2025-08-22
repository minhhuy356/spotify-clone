import { sendRequest } from "@/api/api";
import {
  api_artists,
  api_listening_historys,
  backendUrl,
  url_api_artists,
  url_api_listening_historys,
} from "@/api/url";
import { INewArtist } from "@/app/(admin)/admin/artist/upload/page";
import {
  IAlbum,
  IArtist,
  IAuth,
  IChooseByArtist,
  ITrack,
  IUser,
} from "@/types/data";
export interface IRecentlyItem {
  type: "album" | "artist" | "track";
  data: IAlbum | IArtist | ITrack; // tuỳ bạn định nghĩa
}

export const getRecently = async (access_token: string) => {
  try {
    const res = await sendRequest<IBackendRes<IRecentlyItem[]>>({
      url: `${backendUrl}${api_listening_historys.recently}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data; // trả về danh sách gồm album, artist, track
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách gần đây của người dùng!");
  }
};

export const listening_historys_service = {
  getRecently,
};
