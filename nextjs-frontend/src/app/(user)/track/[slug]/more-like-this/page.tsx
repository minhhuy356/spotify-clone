"use server";

import { cookies } from "next/headers";
import { user_activity_service } from "@/service/user-activity.service";
import LoadingFull from "@/components/loading/loading.full";

import Loading from "@/components/loading/loading";
import { api_auth, backendUrl } from "@/api/url";
import { getNewAccessTokenServer } from "@/app/(server)/utils/get-new-access-token";
import MoreLikeThisTracksMain from "./more-like-this.main";

const MoreLikeThisTracksPage = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const trackId = params.slug;

  const albumPropose = await user_activity_service.fetchAlbumPropose(trackId);

  if (!albumPropose) return <Loading />;

  return (
    <div className="max-w-[1907px] mx-auto">
      {" "}
      <div className="px-8 py-4 my-16 ">
        <h1 className="text-3xl font-bold mb-4 hover:underline cursor-pointer">
          Bản phát hành đề xuất khác
        </h1>
        <MoreLikeThisTracksMain albumPropose={albumPropose} />
      </div>
    </div>
  );
};

export default MoreLikeThisTracksPage;
