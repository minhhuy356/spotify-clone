import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { HtmlHTMLAttributes } from "react";
import { IoTimeOutline } from "react-icons/io5";

import Tooltip from "@/components/tooltip/tooltip";
import { IAlbum, ITrack } from "@/types/data";
import AlbumCardTrack from "./album.card.track";
import { TypeForm } from "@/components/dialog/dialog.collection.form-track";
import { hideTooltip, showTooltip } from "@/lib/features/tooltip/tooltip.slice";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  trackByAlbum: ITrack[];
  typeForm: TypeForm;
  album: IAlbum;
}

const AlbumArtistTableTrack = ({ trackByAlbum, typeForm, album }: IProps) => {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-rows-[auto_1fr] gap-4 text-white-06">
      {/* Header row */}
      <div className="grid grid-cols-[40px_1fr_48px] items-center border-b border-border pb-2 px-6">
        <div>#</div>
        <div>Tiêu đề</div>
        <div
          className="flex justify-end relative group"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();

            dispatch(
              showTooltip({
                content: "Thời lượng",
                position: "top",
                anchorRect: rect,
              })
            );
          }}
          onMouseLeave={() => dispatch(hideTooltip())}
        >
          <IoTimeOutline size={25} />
        </div>
      </div>

      {/* Track rows */}
      <div className="flex flex-col">
        {trackByAlbum.map((track, index) => {
          return (
            <AlbumCardTrack
              album={album}
              trackByAlbum={trackByAlbum}
              typeForm={typeForm}
              track={track}
              index={index}
              key={`${track._id}${index}${typeForm}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AlbumArtistTableTrack;
