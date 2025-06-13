import { sendRequest } from "@/api/api";
import {
  api_user_activity,
  backendUrl,
  url_api_albums,
  url_api_artists,
  url_api_tracks,
  url_api_user_folder,
  url_api_user_playlist,
} from "@/api/url";
import { INewArtist } from "@/app/(admin)/admin/artist/upload/page";
import {
  IAlbum,
  IArtist,
  IAuth,
  IChooseByArtist,
  IFolder,
  IPlaylist,
  ITrack,
  IUser,
  IUserActivity,
} from "@/types/data";
import { Interface } from "readline";

export const createNewPlaylist = async (
  number: number,
  access_token: string
) => {
  try {
    const res = await sendRequest<IBackendRes<IPlaylist>>({
      url: `${backendUrl}${url_api_user_playlist}`,
      method: "POST",
      body: {
        name: `Danh sách phát mới #${number}`,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const createNewFolder = async (number: number, access_token: string) => {
  try {
    const res = await sendRequest<IBackendRes<IFolder>>({
      url: `${backendUrl}${url_api_user_folder}`,
      method: "POST",
      body: {
        name: `Thư mục mới #${number}`,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const subscribeArtist = async (
  session: IAuth,
  action: { artistId: string; quantity: number }
) => {
  try {
    const res = await sendRequest<IBackendRes<IUserActivity<IArtist[]>>>({
      url: `${backendUrl}${api_user_activity.artist}`,
      method: "POST",
      body: {
        artist: action.artistId,
        quantity: action.quantity,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi theo dõi nghệ sĩ");
  }
};

export const subscribeTrack = async (
  session: IAuth,
  action: { trackId: string; quantity: number }
) => {
  try {
    const res = await sendRequest<IBackendRes<IUserActivity<ITrack[]>>>({
      url: `${backendUrl}${api_user_activity.track}`,
      method: "POST",
      body: {
        track: action.trackId,
        quantity: action.quantity,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi theo dõi nghệ sĩ");
  }
};
export const subscribeAlbum = async (
  session: IAuth,
  action: { albumId: string; quantity: number }
) => {
  try {
    const res = await sendRequest<IBackendRes<IUserActivity<IAlbum[]>>>({
      url: `${backendUrl}${api_user_activity.album}`,
      method: "POST",
      body: {
        album: action.albumId,
        quantity: action.quantity,
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi theo dõi nghệ sĩ");
  }
};

export const deleteFolder = async (folderId: string, access_token: string) => {
  try {
    const res = await sendRequest<IBackendRes<IFolder>>({
      url: `${backendUrl}${url_api_user_folder}${folderId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

type KindPin = "album" | "artist" | "track" | "playlist" | "folder";
export const pin = async <T = any>(
  _id: string,
  access_token: string,
  pin: KindPin,
  pinned: boolean
): Promise<T> => {
  try {
    let actionUrl = "";

    switch (pin) {
      case "album":
        actionUrl = url_api_albums;
        break;
      case "artist":
        actionUrl = url_api_artists;
        break;
      case "track":
        actionUrl = url_api_tracks;
        break;
      case "playlist":
        actionUrl = url_api_user_playlist;
        break;
      case "folder":
        actionUrl = url_api_user_folder;
        break;
      default:
        throw new Error("Loại pin không hợp lệ");
    }

    const res = await sendRequest<IBackendRes<T>>({
      url: `${backendUrl}${actionUrl}${_id}`,
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: {
        pinnedAt: pinned ? new Date() : null,
      },
    });

    if (!res.data) {
      throw new Error(`Không tìm thấy dữ liệu trả về từ API khi ghim ${pin}`);
    }

    return res.data;
  } catch (error) {
    throw new Error(`Lỗi khi ghim ${pin}!`);
  }
};

export const user_activity_service = {
  createNewPlaylist,
  createNewFolder,

  deleteFolder,
  subscribeArtist,
  subscribeTrack,
  subscribeAlbum,
  pin,
};
