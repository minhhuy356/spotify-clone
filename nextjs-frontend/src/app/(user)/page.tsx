import AppHeader from "@/components/header/app.header";
import Slider from "@/components/slider/slider";

import { sendRequest } from "@/api/api";
import { ITrack } from "@/types/data";
import { api_track_artists, backendUrl } from "@/api/url";

export default async function HomePage() {
  const balad = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.top}`,
    method: "POST",
    body: { genres: ["Balad"], limit: 10 },
  });

  const rap = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.top}`,
    method: "POST",
    body: { genres: ["Rap"], limit: 10 },
  });

  const pop = await sendRequest<IBackendRes<ITrack[]>>({
    url: `${backendUrl}${api_track_artists.top}`,
    method: "POST",
    body: { genres: ["Pop"], limit: 10 },
  });

  return (
    <div className="">
      <Slider title={"Rap"} data={rap?.data ?? []} />
      <Slider title={"Pop"} data={pop?.data ?? []} />
      <Slider title={"Balad"} data={balad?.data ?? []} />
    </div>
  );
}
