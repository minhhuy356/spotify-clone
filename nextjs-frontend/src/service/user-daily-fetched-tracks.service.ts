import { sendRequest } from "@/api/api";
import { api_user_daily_fetched_tracks, backendUrl } from "@/api/url";
import { ITrack } from "@/types/data";

export type TSortByTrack =
  | "track.countPlay"
  | "track.createdAt"
  | "track.countLike"
  | "track.releaseDay";

export type TOrder = "asc" | "desc";

export const fetchByTrack = async (
  artistsId: string[],
  genresId: string[],
  sortBy: TSortByTrack,
  order: TOrder,
  limit: number,
  access_token: string
) => {
  try {
    const res = await sendRequest<IBackendRes<ITrack[]>>({
      url: `${backendUrl}${api_user_daily_fetched_tracks.fetch_by_track}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      body: {
        artistsId,
        genresId,
        sortBy,
        order,
        limit,
      },
    });

    return res.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy user_daily_fetch_tracks!");
  }
};

export const user_daily_fetch_tracks_service = {
  fetchByTrack,
};
