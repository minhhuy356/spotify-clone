import { IArtist, IMonthlyListener, ITrack } from "@/types/data";
import { sendRequest } from "@/api/api";

import {
  api_track_artists,
  backendUrl,
  url_api_artists,
  url_api_monthly_listeners,
} from "@/api/url";
import MainArtist from "./main.artist";
import { track_artist_service } from "@/service/track-artist.service";
import { artist_service } from "@/service/artist.service";
import { monthly_listener_service } from "@/service/monthly-listener.service";

interface ArtistPageProps {
  params: { slug: string };
}

const DetailArtistPage = async ({ params }: ArtistPageProps) => {
  // Ensure params is awaited before destructuring
  const awaitedParams = await Promise.resolve(params); // Ensures correct handling
  const { slug } = awaitedParams;

  // Handle missing slug
  if (!slug) {
    return <></>; // Redirect to 404 page
  }

  const artist = await artist_service.getArtistById(slug);

  const trackForArtist = await track_artist_service.getTrackForArtist(slug);

  const monthlyListener =
    await monthly_listener_service.getMonthlyListenForArtist(slug);

  if (!artist || !trackForArtist || !monthlyListener) return <></>;

  return (
    <div>
      <MainArtist
        artist={artist}
        trackForArtist={trackForArtist}
        monthlyListener={monthlyListener}
      />
    </div>
  );
};

export default DetailArtistPage;
