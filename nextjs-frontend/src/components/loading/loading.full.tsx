import { AiOutlineLoading3Quarters } from "react-icons/ai";
const LoadingFull = () => {
  return (
    <div className="fixed inset-0 w-full h-full flex justify-center items-center text-green-500 bg-black-07 ">
      <AiOutlineLoading3Quarters size={40} className="animate-spin" />
    </div>
  );
};
export default LoadingFull;
