import { backendUrl, disk_artists, disk_tracks } from "@/api/url";
import { IArtist, IChooseByArtist } from "@/types/data";

interface IProps {
  chooseByArtist: IChooseByArtist;
}

const ChooseByArtist = ({ chooseByArtist }: IProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <span className="text-2xl font-semibold">Lựa chọn của nghệ sĩ</span>
      </div>
      <div className="w-[343px] h-[250px] relative">
        <img
          src={`${backendUrl}${disk_artists.choose}${chooseByArtist.chooseImgUrl}`}
          alt=""
          className="w-full h-full rounded "
        />
        {/* Overlay Tối & Mờ */}
        <div
          className="absolute top-0 bottom-0 right-0 left-0"
          style={{
            background: `linear-gradient(to top, black 0%, transparent 100%)`,
          }}
        ></div>
        <div className="absolute z-[100] bottom-4 right-4 top-4 left-4 flex flex-col justify-between ">
          <div className="flex gap-2  bg-white text-black rounded-full  p-1">
            <img
              src={`${backendUrl}${disk_artists.avatar}${chooseByArtist.artist.avatarImgUrl}`}
              alt=""
              className="size-5 object-center object-cover rounded-full"
            />
            <span>{chooseByArtist.chooseTitle}</span>
          </div>
          <div className="flex gap-4">
            <img
              src={`${backendUrl}${disk_tracks.images}${chooseByArtist.chooseTrack.imgUrl}`}
              alt=""
              className="size-16 object-center object-cover rounded"
            />
            <div className="flex flex-col gap-1 justify-center">
              <span>{chooseByArtist.chooseTrack.title}</span>
              <span>Bài hát</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseByArtist;
