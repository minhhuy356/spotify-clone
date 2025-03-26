"use client";
import countryData from "@/contants/data.country";

import InputTextField from "@/components/input/input.text";
import ResizableTextField from "@/components/input/input.text.area";
import SelectNormal, { OptionType } from "@/components/select/select.normal";
import UploadFile from "@/components/upload/upload.file";
import { useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { sendRequest, sendRequestFile } from "@/api/api";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { init } from "next/dist/compiled/@vercel/og/satori";
import * as React from "react";
import Button, { initialStatus, IStatus } from "@/components/button/button";
import {
  api_files,
  backendUrl,
  disk_artists,
  url_api_artists,
} from "@/api/url";
import { artist_service } from "@/service/artist.service";

export interface INewArtist {
  stageName: string;
  realName: string;
  date: Date | null;
  country: string;
  description: string;
  profileImg: File | null;
  avatarImg: File | null;
  coverImg: File | null;
}

export const initialArtist = {
  stageName: "",
  realName: "",
  country: "",
  description: "",
  date: null,
  profileImg: null,
  avatarImg: null,
  coverImg: null,
};

const Upload = () => {
  const session = useAppSelector(selectSession);

  const [status, setStatus] = React.useState<IStatus>(initialStatus);
  const [artist, setArtist] = React.useState<INewArtist>(initialArtist);
  const [resetFileAvatar, setResetFileAvatar] = React.useState(false);
  const [resetFileProfile, setResetFileProfile] = React.useState(false);
  const [resetFileCover, setResetFileCover] = React.useState(false);
  const uploadImage = async (file: File | null, folderType: string) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await sendRequestFile<IBackendRes<{ fileName: string; mimeType: string }>>({
      url: `${backendUrl}${api_files.upload}`,
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        folder_type: folderType,
        delay: 1000,
      },
    });
  };

  const handleSubmit = async (): Promise<void> => {
    setStatus({ ...status, pending: true });

    if (!session) return;

    const res = await artist_service.uploadArtist(
      artist,
      session?.access_token
    );
    if (res) {
      console.log(true);
      await Promise.all([
        uploadImage(artist.avatarImg, disk_artists.avatar),
        uploadImage(artist.profileImg, disk_artists.cover),
        uploadImage(artist.coverImg, disk_artists.cover),
      ]);
      // Reset form về ban đầu
      setArtist(initialArtist);
      setResetFileAvatar(true);
      setResetFileProfile(true);
      setResetFileCover(true);
      setStatus({ pending: false, success: true, error: false });
    } else {
      setStatus({ pending: false, success: false, error: true });
    }
  };
  const handleChange = async (name: keyof INewArtist, value: any) => {
    setArtist((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!session) return <></>;

  return (
    <div className="w-full max-w-[900px]">
      <div className="flex flex-col gap-3 bg-base py-4">
        <div className="flex gap-3 bg-inherit">
          <InputTextField
            title="Nghệ danh"
            value={artist.stageName}
            onChange={(value) => handleChange("stageName", value)}
          />
          <InputTextField
            title="Tên thật"
            value={artist.realName}
            onChange={(value) => handleChange("realName", value)}
          />
        </div>
        <div className="flex gap-3 bg-inherit">
          <div className="flex-2 h-[48px]">
            <SelectNormal
              title="Chọn quốc gia"
              data={countryData}
              value={
                countryData.find((option) => option.label === artist.country) ||
                null
              } // ✅ Chuyển đổi string thành OptionType
              onChange={(selected) => handleChange("country", selected?.label)} // ✅ Lưu giá trị string vào state
            />
          </div>
          <div className="flex-1 flex">
            <DatePicker
              label="Ngày sinh"
              onChange={(value) => handleChange("date", value)}
              className="!w-full"
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "48px", // Đặt chiều cao
                  width: "100%",
                  display: "flex",
                },

                "& .MuiInputBase-input": {
                  color: "rgb(255 255 255 / 0.6)",
                },
                "& .MuiInputLabel-root": {
                  color: "rgb(255 255 255 / 0.6)",
                  top: "-4px",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgb(255 255 255 / 0.6)",
                },
                "& .MuiSvgIcon-root": {
                  color: "rgb(255 255 255 / 0.6)",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "white !important",
                },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  color: "white !important",
                },
                "&:hover .MuiOutlinedInput-root": {
                  backgroundColor: "rgb(25 25 25 / 1) !important",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white !important",
                },
                "&:hover .MuiInputBase-input": {
                  color: "white !important",
                },
                "&:hover .MuiSvgIcon-root": {
                  color: "white !important",
                },
                "&:hover .MuiInputLabel-root": {
                  color: "white !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused": {
                  backgroundColor: "inherit !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "white !important",
                  },
                "& .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input": {
                  color: "white !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root": {
                  color: "white !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiInputLabel-root": {
                  color: "white !important",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline legend":
                  {
                    color: "white !important",
                  },
              }}
            />
          </div>
        </div>
        <ResizableTextField
          title="Mô tả"
          value={artist.description}
          onChange={(value) => handleChange("description", value)}
        />{" "}
        <div className="w-full">
          <UploadFile
            reset={resetFileProfile}
            type="profile"
            title="Upload Profile Image"
            accept="image"
            onChange={(file) => handleChange("profileImg", file)}
            preview={true}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <UploadFile
              reset={resetFileAvatar}
              title="Upload Avatar Image"
              type="avatar"
              accept="image"
              onChange={(file) => handleChange("avatarImg", file)}
              preview={true}
            />
          </div>
          <div className="flex-1">
            <UploadFile
              reset={resetFileCover}
              title="Upload Cover Image"
              accept="image"
              preview={true}
              type="cover"
              onChange={(file) => handleChange("coverImg", file)}
            />
          </div>
        </div>
        <div className="flex justify-end " onClick={handleSubmit}>
          <Button status={status} setStatus={setStatus} title="Tạo mới" />
        </div>
      </div>
    </div>
  );
};

export default Upload;
