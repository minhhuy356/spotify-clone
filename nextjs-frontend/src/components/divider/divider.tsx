import { HTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

const Divider = ({}: IProps) => {
  return <div className="h-[2px] w-full bg-50 "></div>;
};
export default Divider;
