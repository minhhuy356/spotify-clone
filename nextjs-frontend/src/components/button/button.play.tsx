interface IProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  size?: number;
  bgColor?: string; // thêm prop
  hoverColor?: string; // nếu muốn tùy hover
}

const ButtonPlay: React.FC<IProps> = ({
  size = 1,
  bgColor = "#1ed760",
  hoverColor = "#3be477",
  ...rest
}) => {
  return (
    <div
      className="w-fit cursor-pointer rounded-full shadow-[0_8px_8px_rgba(0,0,0,0.3)] pointer-events-none z-20 transition-all duration-200 ease-out"
      {...rest}
      style={{
        height: `${48 * size}px`,
        width: `${48 * size}px`,
        backgroundColor: bgColor,
        color: "#000",
        scale: (size / 2) * 2,
      }}
    >
      <div className="flex-shrink-0">
        <button
          data-testid="play-button"
          data-encore-id="buttonPrimary"
          data-is-icon-only="true"
          className="bg-transparent border-0 rounded-full cursor-pointer inline-block text-center touch-manipulation select-none align-middle duration-100"
        >
          <span
            className={`flex items-center justify-center rounded-full transition-[background-color,transform] duration-100`}
            style={{
              height: `${48 * size}px`,
              width: `${48 * size}px`,
              backgroundColor: bgColor,
              color: "#000",
              scale: (size / 2) * 2,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                hoverColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLSpanElement).style.backgroundColor =
                bgColor;
            }}
          >
            <span className="flex items-center justify-center">
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" />
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ButtonPlay;
