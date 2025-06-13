import { sendRequest } from "@/api/api";
import {
  backendUrl,
  url_api_user_playlist,
  url_disk_playlists,
} from "@/api/url";
import { IPlaylist } from "@/types/data";
import { uploadFile } from "./upload.service";
import { error } from "console";

export interface IUpdatePlaylist {
  _id: string;
  name: string;
  img?: File;
  description?: string;
}

export const deletePlaylist = async (
  playlistId: string,
  access_token: string
) => {
  try {
    const res = await sendRequest<IBackendRes<IPlaylist>>({
      url: `${backendUrl}${url_api_user_playlist}${playlistId}`,
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

export const updatePlaylist = async (
  updatePlaylist: IUpdatePlaylist,
  access_token: string
) => {
  try {
    const { img, description, name } = updatePlaylist;

    if (img) {
      const imgUrl = await uploadFile(img, url_disk_playlists, access_token);
      if (imgUrl) {
        const res = await sendRequest<IBackendRes<IPlaylist>>({
          url: `${backendUrl}${url_api_user_playlist}${updatePlaylist._id}`,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          body: {
            imgUrl: imgUrl?.fileName || "",
            name: name,
            description: description,
          },
        });
        return res.data;
      }
    } else {
      const res = await sendRequest<IBackendRes<IPlaylist>>({
        url: `${backendUrl}${url_api_user_playlist}${updatePlaylist._id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: {
          imgUrl: "",
          name: name,
          description: description,
        },
      });
      return res.data;
    }
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const user_playlist_service = {
  deletePlaylist,
  updatePlaylist,
};
