import { router_artist } from "@/api/router";
import { backendUrl } from "@/api/url";
import { IArtist } from "@/types/data";
import RelatedArtistCard from "./related.artist.card";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  artistRelated: IArtist[];
}

const RelatedArtistsMain = ({ artistRelated }: IProps) => {
  return (
    <div
      className="grid whitespace-nowrap overflow-hidden  "
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        marginInline: "-12px",
      }}
    >
      {artistRelated.map((artist) => (
        <RelatedArtistCard artist={artist} />
      ))}
    </div>
  );
};
export default RelatedArtistsMain;
