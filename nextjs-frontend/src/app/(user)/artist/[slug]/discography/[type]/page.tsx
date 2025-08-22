"use server";

import Loading from "@/components/loading/loading";

import { artist_service } from "@/service/artist.service";

import DiscographyMain from "./discography.main";
import { track_artist_service } from "@/service/track-artist.service";
import { album_service } from "@/service/album.service";

const DiscographyTypePage = async ({
  params,
}: {
  params?: { slug: string };
}) => {
  console.log(params);
  if (!params) return <Loading />;
  const artistId = params.slug;

  const artist = await artist_service.getArtistById(artistId);

  if (!artist) return <Loading />;
  return <DiscographyMain artist={artist} />;
};

export default DiscographyTypePage;
