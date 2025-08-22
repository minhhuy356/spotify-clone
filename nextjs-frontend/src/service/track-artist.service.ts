import { sendRequest } from "@/api/api";
import {
  api_listening_historys,
  api_track_artists,
  api_tracks,
  backendUrl,
  url_api_track_artists,
} from "@/api/url";
import { INewTrack } from "@/app/(admin)/admin/track/upload/page";
import { TTypeAlbum } from "@/lib/features/scroll-center/scroll-center.slice";
import { IAlbum, ITrack, ITrackArtist } from "@/types/data";
import { duration } from "@mui/material";

type MatchMode = "every" | "some";

export const fetchTrackById = async (_id: string) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack>>({
      url: `${backendUrl}${url_api_track_artists}${_id}`,
      method: "GET",
    });

    return res.data || null;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

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

export const fetchTrackForAlbum = async (albumId: string) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.album}${albumId}`,
      method: "GET",
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của album");
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
          duration: track.duration,
          videoUrl: track.video?.name,
          imgUrl: track.img?.name,
          genres: track.genres,
          releaseDay: track.releaseDay,
          releasedBy: track.releasedBy,
          tags: track.tags,
        },
        artists: track.artists,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return res.data;
  } catch (error) {
    return error;
  }
};

export const fetchTrackByGenre = async (
  genres: string[],
  matchMode: MatchMode,
  limit?: number
) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.genres_name}`,
      method: "POST",
      body: {
        genres: genres,
        limit: limit || 20,
        matchMode: matchMode,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const fetchTrackByTag = async (
  tagId: string,
  sortBy: string,
  takenTracksId: string[]
) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_track_artists.tag}${tagId}`,
      method: "POST",
      queryParams: {
        sortBy: sortBy,
      },
      body: {
        takenTracksId: takenTracksId,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

type TMode = "albumReleasedBy" | "trackArtist";

export const fetchAlbumsByArtist = async (
  artistId: string,
  query: {
    sort?: string;
    limit?: number;
    type?: TTypeAlbum[];
  } = {}
) => {
  try {
    const queryParams: Record<string, any> = {
      ...query,
      type: query.type?.join(","),
    };

    const res = await sendRequest<IBackendRes<IAlbum[]>>({
      url: `${backendUrl}${api_track_artists.albumByArtist}${artistId}`,
      method: "GET",
      queryParams,
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const track_artist_service = {
  getTrackForArtist,
  uploadTrack,
  fetchTrackByGenre,
  fetchTrackForAlbum,
  fetchTrackByTag,
  fetchTrackById,
  fetchAlbumsByArtist,
};
