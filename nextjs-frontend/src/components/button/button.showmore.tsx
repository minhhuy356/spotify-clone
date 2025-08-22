interface ShowMoreButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  totalCount: number;
  minCount: number;
  maxCount: number;
  showMoreText?: string;
  showLessText?: string;
  className?: string;
  showCountLabel?: boolean;
}

const ShowMoreButton = ({
  isExpanded,
  onToggle,
  totalCount,
  minCount,
  maxCount,
  showMoreText = "Xem thêm",
  showLessText = "Hiển thị ít hơn",
  showCountLabel = false,
  className = "",
}: ShowMoreButtonProps) => {
  const shouldShow = totalCount > minCount;

  if (!shouldShow) return null;

  return (
    <div className={` ${className}`}>
      <button
        className="mt-2 text-sm text-white-06 font-bold hover:text-white"
        onClick={onToggle}
      >
        {isExpanded ? showLessText : showMoreText}
        {showCountLabel && (
          <span className="ml-1 text-white-04 text-xs">
            ({isExpanded ? minCount : maxCount})
          </span>
        )}
      </button>
    </div>
  );
};

export default ShowMoreButton;
