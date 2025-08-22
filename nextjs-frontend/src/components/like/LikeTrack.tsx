// "use client";
// import { CircularProgress, Divider } from "@mui/material";
// import { TiHeartFullOutline } from "react-icons/ti";
// import { IoPlaySharp } from "react-icons/io5";
// import { TiHeartOutline } from "react-icons/ti";
// import { useAppDispatch, useAppSelector } from "@/lib/hook";
// import { selectTrack } from "@/lib/features/tracks/tracks.slice";

// import { useEffect, useState } from "react";

// import { sendRequest } from "@/utils/api";
// import { selectSession } from "@/lib/features/auth/auth.slice";

// const likeQueue: Array<{ trackId: string; quantity: number }> = [];
// let isProcessingQueue = false;

// const processLikeQueue = async (session: any) => {
//   // if (isProcessingQueue || likeQueue.length === 0) return;
//   // isProcessingQueue = true;
//   // while (likeQueue.length > 0) {
//   //   const action = likeQueue.shift();
//   //   if (!action) continue;
//   //   try {
//   //     await sendRequest({
//   //       url: `${backendUrl}${url_api_likes}`,
//   //       method: "POST",
//   //       body: {
//   //         track: action.trackId,
//   //         quantity: action.quantity,
//   //       },
//   //       headers: {
//   //         Authorization: `Bearer ${session.access_token}`,
//   //       },
//   //     });
//   //   } catch (error) {
//   //     console.error(
//   //       `Error processing like for track ${action.trackId}:`,
//   //       error
//   //     );
//   //   }
//   // }
//   // isProcessingQueue = false;
// };

// const LikeTrack = () => {
//   const track = useAppSelector(selectTrack);
//   const listLike = useAppSelector(selectListlikes);
//   const isPending = useAppSelector(selectLikeIsPending);

//   const [isLike, setIsLike] = useState<boolean>();
//   const [likeCount, setLikeCount] = useState<number>(track?.countLike || 0);

//   const dispatch = useAppDispatch();
//   const session = useAppSelector(selectSession);
//   const fetchLikeByUser = () => {
//     if (session) {
//       dispatch(
//         likeActions.fetchLikeByUser.pending({
//           access_token: session?.access_token,
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     fetchLikeByUser();
//   }, [session]);

//   useEffect(() => {
//     setIsLike(listLike.some((item) => item._id === track?._id));
//     setLikeCount(track?.countLike || 0); // Đồng bộ giá trị ban đầu từ track
//   }, [listLike, track]);

//   const handleLike = (quantity: number) => {
//     if (session && track?._id) {
//       setIsLike(!isLike);
//       setLikeCount((prev) => prev + quantity); // Cập nhật số lượt thích ngay lập tức
//       likeQueue.push({ trackId: track._id, quantity });
//       processLikeQueue(session);
//     }
//   };

//   return (
//     <div className="mt-4">
//       {isPending ? (
//         <div className="flex justify-center items-center ">
//           <CircularProgress />
//         </div>
//       ) : (
//         <div className="flex justify-between mb-4 px-4">
//           <div></div>
//           <div className="flex gap-4">
//             <div className="flex gap-1 text-gray-400 cursor-pointer items-center">
//               {isLike ? (
//                 <TiHeartFullOutline
//                   className="text-red-500 transition-transform duration-200 ease-in-out hover:scale-125 active:scale-110"
//                   size={35}
//                   onClick={() => handleLike(-1)}
//                 />
//               ) : (
//                 <TiHeartOutline
//                   className="transition-transform duration-200 ease-in-out hover:scale-125 active:scale-110 hover:text-red-500"
//                   size={35}
//                   onClick={() => handleLike(1)}
//                 />
//               )}
//               <div
//                 className={`transition-all duration-300 text-sm font-medium ${
//                   isLike ? "text-red-500" : "text-gray-500"
//                 }`}
//               >
//                 {likeCount}
//               </div>
//             </div>

//             <div className="flex gap-1 text-gray-400 items-center">
//               <IoPlaySharp size={35} />
//               <div>{track?.countPlay}</div>
//             </div>
//           </div>
//         </div>
//       )}

//       <Divider />
//     </div>
//   );
// };

// export default LikeTrack;
