import { sendRequest } from "@/api/api";
import { backendUrl, url_api_artists } from "@/api/url";
import { INewArtist } from "@/app/(admin)/admin/artist/upload/page";
import { IArtist, IAuth, IUser } from "@/types/data";

export const getArtistById = async (_id: string) => {
  try {
    const trackForArtist = await sendRequest<IBackendRes<IArtist>>({
      url: `${backendUrl}${url_api_artists}${_id}`,
      method: "GET",
    });
    console.log(trackForArtist.data);
    return trackForArtist.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const uploadArtist = async (
  artist: INewArtist,
  access_token: string
) => {
  try {
    const trackForArtist = await sendRequest<IBackendRes<INewArtist>>({
      url: `${backendUrl}${url_api_artists}`,
      method: "POST",
      body: {
        stageName: artist.stageName,
        realName: artist.realName,
        date: artist.date,
        description: artist.description,
        avatarImgUrl: artist.avatarImg?.name,
        coverImgUrl: artist.coverImg?.name,
        profileImgUrl: artist.profileImg?.name,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    return trackForArtist.data;
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách bài hát của nghệ sĩ");
  }
};

export const artist_service = {
  getArtistById,
  uploadArtist,
};
