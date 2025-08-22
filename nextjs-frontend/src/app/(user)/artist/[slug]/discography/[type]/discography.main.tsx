"use client";
import { IArtist } from "@/types/data";

import ClassifyDiscographyMain from "./classify.discography.main";
import WebsiteInformation from "@/components/footer/website-information";

interface IProps {
  artist: IArtist;
}

const DiscographyMain = ({ artist }: IProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute top-[104px] bottom-0 left-0 right-0">
        <div className="px-4 flex max-w-[1955px] mx-auto w-full">
          <div className="px-8 w-full">
            <ClassifyDiscographyMain artist={artist} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscographyMain;
