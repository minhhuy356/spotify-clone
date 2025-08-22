import { selectSession } from "@/lib/features/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { HtmlHTMLAttributes } from "react";
import { IoTimeOutline } from "react-icons/io5";
import CollectionCardTrack from "./collection.card.track";
import { TypeForm } from "@/components/dialog/dialog.collection.form-track";
import Tooltip from "@/components/tooltip/tooltip";
import { hideTooltip, showTooltip } from "@/lib/features/tooltip/tooltip.slice";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  typeForm: TypeForm;
}

const CollectionArtistTableTrack = ({ typeForm }: IProps) => {
  const session = useAppSelector(selectSession);
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col  gap-4 text-white-06 ">
      <div className="flex gap-4 w-full h-auto border-b border-border pb-2 px-4">
        <div className="pl-2">#</div>
        <div className="flex-2">Tiêu đề</div>{" "}
        <div className="flex-1 15xl:flex hidden">Album</div>{" "}
        <div className="flex-1 2xl:flex hidden">Ngày thêm</div>{" "}
        <div className="flex-1 flex justify-end group relativ ">
          <div
            className="w-12 relative mr-4"
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
      </div>
      <div className="flex flex-col">
        {session?.user.tracks.map((track, index) => {
          return (
            <CollectionCardTrack
              allTrackCollection={session?.user.tracks}
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

export default CollectionArtistTableTrack;
