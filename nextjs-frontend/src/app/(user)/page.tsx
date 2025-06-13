import AppHeader from "@/components/header/app.header";
import Slider from "@/components/slider/slider";

import { sendRequest } from "@/api/api";
import { ITrack } from "@/types/data";
import { api_track_artists, backendUrl, url_api_albums } from "@/api/url";

export default async function HomePage() {
  const balad = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.genres_name}`,
    method: "POST",
    body: { genres: ["Balad"], limit: 10 },
  });

  const rap = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.genres_name}`,
    method: "POST",
    body: { genres: ["Rap"], limit: 10 },
  });

  const pop = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.genres_name}`,
    method: "POST",
    body: { genres: ["Pop"], limit: 10 },
  });

  const album = await sendRequest<IBackendRes<IModelPaginate<ITrack[]>>>({
    url: `${backendUrl}${url_api_albums}`,
    method: "GET",
  });

  return (
    <>
      <Slider title={"Rap"} data={rap?.data ?? []} typeData="track" />
      <Slider title={"Pop"} data={pop?.data ?? []} typeData="track" />
      <Slider title={"Balad"} data={balad?.data ?? []} typeData="track" />{" "}
      <Slider
        title={"Album"}
        data={album?.data?.result ?? []}
        typeData="album"
      />
    </>
  );
}
