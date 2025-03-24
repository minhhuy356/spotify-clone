import "./button.css";
import { ITrack } from "@/types/data";
interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const ButtonPause: React.FC<IButtonProps> = (props) => {
  return (
    <>
      {/**nút copy từ spotify */}
      <div className="woJQ5t2YiaJhjTv_KE7p ">
        <div className="ix_8kg3iUb9VS5SmTnBY">
          <button
            data-testid="play-button"
            aria-label="Phát buitruonglinh Radio"
            data-encore-id="buttonPrimary"
            data-is-icon-only="true"
            className="Button-sc-qlcn5g-0 iPAIAO e-9541-button-primary e-9541-button"
          >
            <span className="ButtonInner-sc-14ud5tc-0 TFilp encore-bright-accent-set e-9541-button-icon-only--medium e-9541-button-primary__inner">
              <span aria-hidden="true" className="e-9640-button__icon-wrapper">
                <svg
                  data-encore-id="icon"
                  role="img"
                  aria-hidden="true"
                  className="bneLcE e-9541-icon"
                  viewBox="0 0 24 24"
                >
                  <path d="M5.7 3a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7H5.7zm10 0a.7.7 0 0 0-.7.7v16.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V3.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
                </svg>
              </span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ButtonPause;
