import { useState } from "react";
import CardTrackArtist from "@/app/(user)/artist/[slug]/main/card/artist.card.track.";
import { IArtist, ITrack } from "@/types/data";

interface IProps {
  trackForArtist: ITrack[];
  artist: IArtist;
}

const maxTrack = 5;

const ArtistTableTrack = ({ trackForArtist, artist }: IProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedTracks = showAll
    ? trackForArtist
    : trackForArtist.slice(0, maxTrack);

  return (
    <div>
      <div className="mb-6">
        <span className="text-2xl font-semibold">Phổ biến</span>
      </div>

      <div className="flex flex-col">
        {displayedTracks.map((track, index) => (
          <CardTrackArtist
            key={track._id}
            artist={artist}
            track={track}
            index={index}
            trackForArtist={trackForArtist}
          />
        ))}
      </div>

      {/* Hiển thị nút nếu có nhiều hơn 2 bài hát */}
      {trackForArtist.length > maxTrack && (
        <div
          onClick={() => setShowAll(!showAll)}
          className="mt-3 px-4 py-2  text-white-06  cursor-pointer font-semibold hover:text-white"
        >
          {showAll ? "Ẩn bớt" : "Xem thêm"}
        </div>
      )}
    </div>
  );
};

export default ArtistTableTrack;
