import { HTMLAttributes, useRef, useState } from "react";
import AudioPlayer from "../audio/audio.player";
import { useAppSelector } from "@/lib/hook";
import { selectCurrentTrack } from "@/lib/features/tracks/tracks.slice";
import { backendUrl, disk_tracks } from "@/api/url";
import VolumeControl from "./volume";
import Divider from "../divider/divider";
import { MdOutlineFacebook } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface IProps extends HTMLAttributes<HTMLDivElement> {}

const WebsiteInformation = ({}: IProps) => {
  const company = [
    {
      title: "Giới thiệu",
    },
    {
      title: "Việc làm",
    },

    {
      title: "For the Record",
    },
  ];
  const community = [
    {
      title: "Dành cho các Nghệ sĩ",
    },
    {
      title: "Nhà phát triển",
    },

    {
      title: "Quảng cáo",
    },
    {
      title: "Nhà đầu tư",
    },
    {
      title: "Nhà cung cấp",
    },
  ];
  const usefulLinks = [
    {
      title: "Hỗ trợ",
    },
    {
      title: "Ứng dụng Di động Miễn phí",
    },
  ];
  const webPackages = [
    {
      title: "Premium Individual",
    },
    {
      title: "Premium Student",
    },

    {
      title: "Web Free",
    },
  ];
  return (
    <div className="flex flex-col">
      <div className="my-8">
        <Divider />
      </div>
      <div className="flex gap-8 my-8  px-4">
        <div className="flex-1 flex flex-col gap-2">
          <span className="font-bold">{company && "Công ty"}</span>
          <div className="text-white-06 flex-col flex gap-1">
            {company.map((item, index) => {
              return (
                <span className="hover:text-white hover:underline cursor-pointer">
                  {item.title}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <span className="font-bold">{community && "Cộng đồng"}</span>
          <div className="text-white-06 flex-col flex gap-1">
            {community.map((item, index) => {
              return (
                <span className="hover:text-white hover:underline cursor-pointer">
                  {item.title}
                </span>
              );
            })}
          </div>
        </div>{" "}
        <div className="flex-1 flex flex-col gap-2">
          <span className="font-bold">{usefulLinks && "Liên kết hữu ích"}</span>
          <div className="text-white-06 flex-col flex gap-1">
            {usefulLinks.map((item, index) => {
              return (
                <span className="hover:text-white hover:underline cursor-pointer">
                  {item.title}
                </span>
              );
            })}
          </div>
        </div>{" "}
        <div className="flex-1 flex flex-col gap-2">
          <span className="font-bold">{webPackages && "Các gói của Web"}</span>
          <div className="text-white-06 flex-col flex gap-1">
            {webPackages.map((item, index) => {
              return (
                <span className="hover:text-white hover:underline cursor-pointer">
                  {item.title}
                </span>
              );
            })}
          </div>
        </div>{" "}
        <div className="flex-[1.5] flex gap-6 justify-end h-fit">
          <div className="bg-40 p-3 rounded-full hover:bg-90">
            <FaInstagram size={25} />
          </div>
          <div className="bg-40 p-3 rounded-full  hover:bg-90">
            <FaXTwitter size={25} />
          </div>{" "}
          <div className="bg-40 p-3 rounded-full  hover:bg-90">
            <MdOutlineFacebook size={25} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteInformation;
