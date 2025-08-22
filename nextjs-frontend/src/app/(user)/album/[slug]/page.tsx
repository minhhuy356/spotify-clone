// app/album/[slug]/page.tsx

import Color from "color";

import { disk_albums, backendUrl } from "@/api/url";
import { album_service } from "@/service/album.service";
import { track_artist_service } from "@/service/track-artist.service";
import AlbumMain from "./album.main";
import Loading from "@/components/loading/loading";

interface Props {
  params: { slug: string };
}

const AlbumPage = async ({ params }: Props) => {
  const slug = params.slug;

  const album = await album_service.findById(slug);
  if (!album) return <Loading />;

  return <AlbumMain album={album} />;
};

export default AlbumPage;
