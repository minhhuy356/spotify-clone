import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  backendUrl,
  url_api_track_artists,
} from "@/api/url";
import { INewTrack } from "@/app/(admin)/admin/track/upload/page";
import { ITrack } from "@/types/data";

type MatchMode = "every" | "some";

export const getTrackForArtist = async (_id: string, sortBy?: string) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.artist}${_id}`,
      method: "GET",
      queryParams: {
        sortBy: sortBy,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const uploadTrack = async (track: INewTrack, access_token: string) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${url_api_track_artists}`,
      method: "POST",
      body: {
        track: {
          title: track.title,
          audioUrl: track.audio?.name,
          videoUrl: track.video?.name,
          imgUrl: track.img?.name,
          genres: track.genres,
          releaseDay: track.releaseDay,
          releasedBy: track.releasedBy,
        },
        artists: track.artists,
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

export const fetchWaitlistBasedOnGenre = async (
  genres: string[],
  matchMode: MatchMode
) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.top}`,
      method: "POST",
      body: {
        genres: genres,
        limit: 20,
        matchMode: matchMode,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const track_artist_service = {
  getTrackForArtist,
  uploadTrack,
  fetchWaitlistBasedOnGenre, // Định nghĩa service chứa hàm
};
