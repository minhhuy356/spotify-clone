import SongCardArtist from "@/components/card/card.song.artist";
import SongCard from "@/components/card/card.song.artist";
import { IArtist, ITrack } from "@/types/data";
interface IProps {
  trackForArtist: ITrack[];
  artist: IArtist;
}

const PopularTrack = ({ trackForArtist, artist }: IProps) => {
  return (
    <div className="">
      <div className="mb-6">
        <span className="text-2xl font-semibold ">Phổ biến</span>
      </div>

      <div className="flex flex-col ">
        {" "}
        {trackForArtist.map((track, index) => {
          return (
            <SongCardArtist
              artist={artist}
              track={track}
              index={index}
              trackForArtist={trackForArtist}
            />
          );
        })}
      </div>
    </div>
  );
};
export default PopularTrack;
