import { image_favorite } from "@/api/url";
import { FaHeart } from "react-icons/fa";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {}
const IconFavorite = ({}: IProps) => {
  return <img src={image_favorite} alt="" />;
};

export default IconFavorite;
