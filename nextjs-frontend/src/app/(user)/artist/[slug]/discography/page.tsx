"use server";

import Loading from "@/components/loading/loading";

import { artist_service } from "@/service/artist.service";

import { track_artist_service } from "@/service/track-artist.service";

import DiscographyTypePage from "./[type]/page";
import { TTypeAlbum } from "@/lib/features/scroll-center/scroll-center.slice";

const DiscographyPage = async ({
  params,
}: {
  params?: { slug: string; type: TTypeAlbum };
}) => {
  return <DiscographyTypePage params={params} />;
};

export default DiscographyPage;
