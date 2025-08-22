import { GroupedArtist } from "@/components/main/right/main.right";
import { order } from "@/contants/artist.type";
import { ITrackArtist } from "@/types/data";

class ArtistSorter {
  static sortAndGroupArtists(
    artists: ITrackArtist[],
    releasedBy: string
  ): GroupedArtist[] {
    // Step 1: Sort artists by artistTypeGroup
    const sortedArtist = [...artists].sort((a, b) => {
      const groupA =
        a.artistTypeDetail.artistTypeGroup?.name?.toUpperCase() || "";
      const groupB =
        b.artistTypeDetail.artistTypeGroup?.name?.toUpperCase() || "";
      return (order[groupA] || 0) - (order[groupB] || 0);
    });

    // Step 2: Group the artists
    const groupedArtistList = Object.values(
      sortedArtist
        .sort((a, b) => a.artistTypeDetail.order - b.artistTypeDetail.order)
        .reduce((acc, item) => {
          const key = `${item.artist._id}-${item.useStageName}`;
          if (!acc[key]) {
            acc[key] = {
              artist: item.artist,
              useStageName: item.useStageName,
              artistTypeGroup: item.artistTypeDetail.artistTypeGroup,
              artistTypeDetails: [],
            };
          }
          acc[key].artistTypeDetails.push(item.artistTypeDetail);
          return acc;
        }, {} as Record<string, GroupedArtist>)
    );

    // Step 3: Filter by stage name
    const filtered = groupedArtistList.filter(
      (item) => item.useStageName === true
    );

    // Step 4: Prioritize releasedBy artist
    if (releasedBy) {
      filtered.sort((a, b) => {
        if (a.artist._id === releasedBy) return -1;
        if (b.artist._id === releasedBy) return 1;
        return 0;
      });
    }

    return filtered;
  }
}

export default ArtistSorter;
