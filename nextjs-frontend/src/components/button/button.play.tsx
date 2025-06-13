import "./button.css";

interface IProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  size?: number;
}

const ButtonPlay: React.FC<IProps> = ({ size = 1 }) => {
  return (
    <div className="woJQ5t2YiaJhjTv_KE7p w-fit cursor-pointer">
      <div className="ix_8kg3iUb9VS5SmTnBY">
        <button
          data-testid="play-button"
          data-encore-id="buttonPrimary"
          data-is-icon-only="true"
          className="Button-sc-qlcn5g-0 iPAIAO e-9541-button-primary e-9541-button"
        >
          <span
            className={`ButtonInner-sc-14ud5tc-0  encore-bright-accent-set e-9541-button-icon-only--medium e-9541-button-primary__inner TFilp`}
            style={{ scale: (size / 2) * 2 }}
          >
            <span
              aria-hidden="true"
              className="IconWrapper__Wrapper-sc-1hf1hjl-0 cfLISg"
            >
              <svg
                data-encore-id="icon"
                role="img"
                aria-hidden="true"
                className={`Svg-sc-ytk21e-0 e-9541-icon bneLcE`}
                viewBox="0 0 24 24"
              >
                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
              </svg>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ButtonPlay;
