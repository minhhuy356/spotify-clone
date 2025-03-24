import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Loading = () => {
  return (
    <div className="w-full h-full flex justify-center items-center text-green-500">
      <AiOutlineLoading3Quarters size={40} className="animate-spin" />
    </div>
  );
};
export default Loading;
