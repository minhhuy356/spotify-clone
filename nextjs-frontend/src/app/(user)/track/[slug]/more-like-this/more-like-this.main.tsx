import { backendUrl } from "@/api/url";
import { IAlbum, ITrack } from "@/types/data";
import RelatedTrackCard from "./more-like-this.card";
import MoreLikeThisTrackCard from "./more-like-this.card";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  albumPropose: IAlbum[];
}

const MoreLikeThisTracksMain = ({ albumPropose }: IProps) => {
  return (
    <div
      className="grid whitespace-nowrap overflow-hidden  "
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        marginInline: "-12px",
      }}
    >
      {albumPropose.map((album) => (
        <MoreLikeThisTrackCard album={album} />
      ))}
    </div>
  );
};
export default MoreLikeThisTracksMain;
