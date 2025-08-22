"use server";

import { cookies } from "next/headers";
import { user_activity_service } from "@/service/user-activity.service";
import LoadingFull from "@/components/loading/loading.full";
import RelatedArtistsMain from "./related.main.";

import Loading from "@/components/loading/loading";
import { api_auth, backendUrl } from "@/api/url";
import { getNewAccessTokenServer } from "@/app/(server)/utils/get-new-access-token";

const RelatedArtistsPage = async ({ params }: { params: { slug: string } }) => {
  const artistId = params.slug;

  const artistRelated = await user_activity_service.fetchArtistAlsoLiked(
    artistId
  );

  if (!artistRelated) return <Loading />;

  return (
    <div className="max-w-[1907px] mx-auto">
      {" "}
      <div className="px-8 py-4 my-16 ">
        <h1 className="text-3xl font-bold mb-4 hover:underline cursor-pointer">
          Fan cũng thích
        </h1>
        <RelatedArtistsMain artistRelated={artistRelated} />
      </div>
    </div>
  );
};

export default RelatedArtistsPage;
