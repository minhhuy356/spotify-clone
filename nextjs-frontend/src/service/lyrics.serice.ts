import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  api_tracks,
  backendUrl,
  url_api_lyrics,
  url_api_track_artists,
} from "@/api/url";

import { ILyrics } from "@/types/data";

export const fetchLyricsByTrack = async (trackId: string) => {
  try {
    const res = await sendRequest<IBackendRes<ILyrics>>({
      url: `${backendUrl}${url_api_lyrics}${trackId}`,
      method: "GET",
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const lyrics_service = {
  fetchLyricsByTrack,
};
