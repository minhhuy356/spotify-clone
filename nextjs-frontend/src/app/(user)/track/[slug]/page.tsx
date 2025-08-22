// app/track/[slug]/page.tsx hoặc tương ứng
import { track_artist_service } from "@/service/track-artist.service";
import { track_service } from "@/service/track.service";

import { ITrack } from "@/types/data";
import TrackMain from "./track.main"; // đảm bảo đây là 1 client component

interface IProps {
  params: { slug: string };
}

const TrackHome = async ({ params }: IProps) => {
  const trackId = params.slug;

  const track: ITrack | null = await track_artist_service.fetchTrackById(
    trackId
  );
  if (!track) return <div>Không tìm thấy bài hát</div>;

  return (
    <div>
      <TrackMain track={track} />
    </div>
  );
};

export default TrackHome;
