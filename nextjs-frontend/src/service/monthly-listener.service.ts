import { sendRequest } from "@/api/api";
import {
  backendUrl,
  url_api_artists,
  url_api_monthly_listeners,
} from "@/api/url";
import { IArtist, IMonthlyListener } from "@/types/data";

export const getMonthlyListenForArtist = async (_id: string) => {
  try {
    const trackForArtist = await sendRequest<IBackendRes<IMonthlyListener>>({
      url: `${backendUrl}${url_api_monthly_listeners}${_id}`,
      method: "GET",
    });

    return trackForArtist.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const monthly_listener_service = {
  getMonthlyListenForArtist, // Định nghĩa service chứa hàm
};
