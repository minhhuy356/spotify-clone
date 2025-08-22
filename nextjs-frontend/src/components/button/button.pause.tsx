import { ITrack } from "@/types/data";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  bgColor?: string; // thêm prop
  hoverColor?: string; // nếu muốn tùy hover
}

const ButtonPause: React.FC<IButtonProps> = ({
  size = 1,
  bgColor = "#1ed760",
  hoverColor = "#3be477",
  ...rest
}) => {
  return (
    <div
      className="w-fit rounded-full shadow-[0_8px_8px_rgba(0,0,0,0.3)] pointer-events-none z-20 transition-all duration-200 ease-out "
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
          {...rest}
          data-testid="play-button"
          aria-label="Phát buitruonglinh Radio"
          data-encore-id="buttonPrimary"
          data-is-icon-only="true"
          className="bg-transparent border-0 rounded-full cursor-pointer inline-block text-center touch-manipulation select-none align-middle duration-100"
        >
          <span
            className="flex items-center justify-center rounded-full transition-[background-color,transform] duration-100 group-bg-[#1ed760] group-hover:bg-[#3be477]"
            style={{
              height: `${48 * size}px`,
              width: `${48 * size}px`,
              backgroundColor: bgColor,
              color: "#000",
              scale: (size / 2) * 2,
            }}
          >
            <span
              aria-hidden="true"
              className="flex items-center justify-center"
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className="w-6 h-6 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ButtonPause;
