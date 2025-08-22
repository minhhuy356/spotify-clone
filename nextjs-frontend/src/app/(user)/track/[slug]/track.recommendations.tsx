import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";
import { lyrics_service } from "@/service/lyrics.serice";
import { ILyrics, ITrack } from "@/types/data";
import { HtmlHTMLAttributes, useEffect, useState } from "react";

interface IProps extends HtmlHTMLAttributes<HTMLDivElement> {
  track: ITrack;
}

const PageTrackRecommendations = ({ track }: IProps) => {
  const [lyrics, setLyrics] = useState<ILyrics>();
  const [expanded, setExpanded] = useState(false);

  const { ref: wrapperRef, breakpoint } = useResponsiveBreakpoint();

  const fetchLyricByTrack = async () => {
    if (track) {
      const res = await lyrics_service.fetchLyricsByTrack(track._id.toString());
      if (res) setLyrics(res);
    }
  };

  useEffect(() => {
    fetchLyricByTrack();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`flex gap-10 ${
        breakpoint.below1200 ? "flex-col" : "flex-row"
      }`}
    >
      {/* Nội dung */}
      <div></div>
    </div>
  );
};
export default PageTrackRecommendations;
