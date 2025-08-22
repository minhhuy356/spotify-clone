import { sendRequest } from "@/api/api";
import {
  api_track_artists,
  api_tracks,
  backendUrl,
  url_api_track_artists,
} from "@/api/url";
import { INewTrack } from "@/app/(admin)/admin/track/upload/page";
import { ITrack } from "@/types/data";

export const increaseCountView = async (body: {
  userId: string;
  trackId?: string;
  albumId?: string;
  artistId?: string;
}) => {
  const { userId, albumId, artistId, trackId } = body;

  try {
    const res = await sendRequest<IBackendRes<string>>({
      url: `${backendUrl}${api_tracks.increaseView}`,
      method: "POST",
      body: { trackId, albumId, artistId, userId },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const fetchTrackyReleasedBy = async (
  releasedById: string,
  query: {
    sort?: string;
    limit?: number;
  } = {}
) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_tracks.releasedBy}${releasedById}`,
      method: "GET",
      queryParams: query,
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const track_service = {
  increaseCountView, // Định nghĩa service chứa hàm
  fetchTrackyReleasedBy,
};
