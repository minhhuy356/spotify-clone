"use client";
import * as React from "react";

import UploadFile from "@/components/upload/upload.file";
import SelectSearchable, {
  OptionType,
} from "@/components/select/select.searchable";
import { DatePicker } from "@mui/x-date-pickers";
import SelectNormal from "@/components/select/select.normal";
import Button, { initialStatus, IStatus } from "@/components/button/button";

import { IArtist, IArtistTypeDetail, IGenres, ITrack } from "@/types/data";
import { useAppDispatch, useAppSelector } from "@/lib/hook";

import { selectSession } from "@/lib/features/auth/auth.slice";
import {
  fetchAllArtists,
  fetchAllArtistTypeDetails,
  selectListArtists,
  selectListArtistTypeDetails,
} from "@/lib/features/artists/artist.slice";
import dayjs, { Dayjs } from "dayjs";
import {
  fetchAllGenres,
  selectListGenres,
} from "@/lib/features/genres/genre.slice";

import { FaTrash } from "react-icons/fa";
import { IoIosAddCircle, IoMdAddCircle } from "react-icons/io";
import { NAME_USER_PREVIEW_IMG } from "@/contants/preview";
import {
  api_files,
  backendUrl,
  disk_artists,
  disk_tracks,
  url_api_track_artists,
  url_disk_preview,
} from "@/api/url";
import { track_artist_service } from "@/service/track-artist.service";
import { uploadFile } from "@/service/upload.service";
import InputTextFieldForAdmin from "@/components/input/admin/input.text";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface ITrackUpload {
  fileName: string;
  percent: number;
  uploadedTrackName: string;
}

export interface INewTrack {
  title: string;
  artists: IValueArtist[];
  audio: File | null;
  video: File | null;
  img: File | null;
  genres: string[];
  releaseDay: Dayjs;
  releasedBy: string;
}

interface IValueArtist {
  artist: string | null;
  artistTypeDetail: string;
  useStageName: boolean;
}

export const initialTrackNew = {
  title: "",
  artists: [],
  audio: null,
  video: null,
  img: null,
  genres: [],
  releaseDay: dayjs(),
  releasedBy: "",
};

const Upload = () => {
  const [info, setInfo] = React.useState<INewTrack>(initialTrackNew);
  const [status, setStatus] = React.useState<IStatus>(initialStatus);

  const session = useAppSelector(selectSession);

  const [resetFileImage, setResetFileImage] = React.useState(false);
  const [resetFileVideo, setResetFileVideo] = React.useState(false);
  const [resetFileAudio, setResetFileAudio] = React.useState(false);

  const dispatch = useAppDispatch();
  const listArtistTypeDetails = useAppSelector(selectListArtistTypeDetails);
  const listArtists = useAppSelector(selectListArtists);
  const listGenres = useAppSelector(selectListGenres);

  const [optionArtistTypeDetail, setOptionArtistTypeDetail] = React.useState<
    OptionType[]
  >([]);
  const [optionArtists, setOptionArtists] = React.useState<OptionType[]>([]);
  const [optionGenres, setOptionGenres] = React.useState<OptionType[]>([]);
  const [optionReleasedBy, setOptionReleasedBy] = React.useState<OptionType[]>(
    []
  );

  const [valueArtists, setValueArtists] = React.useState<OptionType[]>([]);

  const [selectedArtists, setSelectedArtists] = React.useState<
    {
      artist: string | null;
      useStageName: boolean;
      artistTypeDetail: string;
    }[]
  >([]); // Lưu trạng thái radio

  const handleChangeInput = (index: number, value: string) => {
    const foundArtist = selectedArtists[index];
    if (foundArtist) {
      foundArtist.useStageName = value === "true";
      setSelectedArtists([...selectedArtists]); // Cập nhật lại state
    }
    setInfo((prev) => ({
      ...prev,
      artists: selectedArtists,
    }));
  };

  const handleChangeArtistTypeDetail = (index: number, value: string) => {
    const foundArtist = selectedArtists[index];
    if (foundArtist) {
      foundArtist.artistTypeDetail = value;
      setSelectedArtists([...selectedArtists]); // Cập nhật lại state
    }
    setInfo((prev) => ({
      ...prev,
      artists: selectedArtists,
    }));
  };

  React.useEffect(() => {
    fetchAll();
  }, []);

  React.useEffect(() => {
    const data = listArtistTypeDetails.map((item: IArtistTypeDetail) => {
      return {
        value: item._id,
        label: item.name,
      };
    });
    if (data) {
      setOptionArtistTypeDetail(data);
    }
  }, [listArtistTypeDetails]);

  const fetchAll = () => {
    dispatch(fetchAllArtistTypeDetails());
    dispatch(fetchAllArtists());
    dispatch(fetchAllGenres());
  };

  React.useEffect(() => {
    const data = listArtists.map((item: IArtist) => {
      return {
        value: item._id,
        label: item.stageName,
      };
    });
    if (data) {
      setOptionArtists(data);
      setOptionReleasedBy(data);
    }
  }, [listArtists]);

  React.useEffect(() => {
    const data: OptionType[] = listGenres.map((item: IGenres) => ({
      value: item._id,
      label: item.name,
    }));
    if (data) {
      setOptionGenres(data);
    }
  }, [listGenres]);

  // React.useEffect(() => {
  //   if (trackUpload && trackUpload.uploadedTrackName) {
  //     setTrackUpload((prevState) => ({
  //       ...prevState,
  //       percent: 100,
  //     }));

  //     setInfo({
  //       ...info,
  //       trackUrl: trackUpload.uploadedTrackName,
  //     });
  //   }
  // }, [value, trackUpload]);

  const handleSubmit = async (): Promise<void> => {
    if (!session) return;

    setValueArtists([]);
    setSelectedArtists([]);

    const res = await track_artist_service.uploadTrack(
      info,
      session?.access_token
    );

    if (res) {
      const isUpload = await Promise.all([
        uploadFile(info.audio, disk_tracks.audios, session.access_token),
        uploadFile(info.video, disk_tracks.videos, session.access_token),
        uploadFile(info.img, disk_tracks.images, session.access_token),
      ]);
      if (isUpload) {
        // Reset form về ban đầu
        setInfo(initialTrackNew);
        setResetFileImage(true);
        setResetFileVideo(true);
        setResetFileAudio(true);

        setStatus({ pending: false, success: true, error: false });
      }
    } else {
      setStatus({ pending: false, success: false, error: true });
    }
  };

  const handleChange = async (name: keyof any, value: any) => {
    setInfo((prev) => ({
      ...prev,
      [name]: name === "artists" ? "" : value,
    }));

    if (name === "artists") {
      setValueArtists(value);

      const news = [...selectedArtists];
      news.push({
        artist: value[value.length - 1].value,
        artistTypeDetail: "",
        useStageName: "true" === "true" ? true : false,
      });
      setSelectedArtists(news);
      setInfo((prev) => ({
        ...prev,
        artists: news,
      }));
    }
  };

  return (
    <div className="w-full max-w-[900px]">
      <div className="">
        <div className="flex flex-col gap-3">
          <UploadFile
            reset={resetFileAudio}
            accept="audio"
            title="Audio"
            onChange={(file) => handleChange("audio", file)}
          />
          <div className="flex flex-col xl:flex-row gap-3">
            <div className="w-full flex-3">
              <div className="">
                <div className=" flex flex-col gap-3 bg-base">
                  <div className=" flex gap-3 relative bg-base">
                    <InputTextFieldForAdmin
                      title="Tên"
                      value={info.title ? info.title : ""}
                      onChange={(value) => handleChange("title", value)}
                    />
                    <SelectNormal
                      onChange={(selected) =>
                        handleChange("releasedBy", selected?.value)
                      }
                      value={
                        optionReleasedBy.find(
                          (option) => option.value === info.releasedBy
                        ) || null
                      } // ✅ Chuyển đổi string thành OptionType
                      title="Phát hành bởi"
                      data={optionReleasedBy}
                    />
                  </div>
                  <div className="flex flex-col gap-3 bg-base">
                    <SelectSearchable
                      value={valueArtists}
                      title="Nghệ sĩ tham gia"
                      data={optionArtists}
                      onChange={(selected) => handleChange("artists", selected)} // ✅ Truyền nguyên mảng object
                      type="artist"
                    />

                    {valueArtists &&
                      valueArtists.map((valueArtist, index: number) => {
                        const artist = listArtists.find(
                          (artist) => artist._id === valueArtist.value
                        );

                        return (
                          <div
                            className="flex flex-col justify-center  "
                            key={valueArtist.index}
                          >
                            <div className="flex items-center py-3 justify-between border-b border-border">
                              <div className="flex  items-center flex-1 ">
                                <div className="size-10">
                                  {artist?.avatarImgUrl ? (
                                    <img
                                      src={`${backendUrl}${disk_artists.avatar}${artist?.avatarImgUrl}`}
                                      alt=""
                                      className="size-10 object-cover object-top rounded-full"
                                    />
                                  ) : (
                                    <img
                                      src={`${backendUrl}${url_disk_preview}${NAME_USER_PREVIEW_IMG}`}
                                      alt=""
                                      className="size-10 object-cover object-top rounded-full"
                                    />
                                  )}
                                </div>

                                <div
                                  className={` transition-all duration-500 text-ellipsis overflow-hidden pl-3 ${
                                    selectedArtists[index]?.useStageName
                                      ? "w-28"
                                      : "w-[calc(100%-3rem)]"
                                  } `}
                                >
                                  <span className={` line-clamp-1`}>
                                    {selectedArtists[index]?.useStageName
                                      ? artist?.stageName
                                      : artist?.realName || artist?.stageName}
                                  </span>
                                </div>
                              </div>
                              <div className="px-5 py-3 flex-1">
                                <div className="flex items-center gap-3">
                                  <SelectNormal
                                    onChange={(selected) => {
                                      selected?.value &&
                                        handleChangeArtistTypeDetail(
                                          index,
                                          selected?.value
                                        );
                                    }}
                                    value={
                                      optionArtistTypeDetail.find(
                                        (option) =>
                                          option.value ===
                                          selectedArtists[index]
                                            .artistTypeDetail
                                      ) || null
                                    } // ✅ Chuyển đổi string thành OptionType
                                    title="Loại nghệ sĩ"
                                    data={optionArtistTypeDetail}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-3 items-center">
                                {" "}
                                <input
                                  className="size-[14px] accent-black"
                                  id={`stageName-${artist?._id}-${index}`}
                                  type="radio"
                                  title="Nghệ danh"
                                  value={"true"}
                                  checked={
                                    selectedArtists[index]?.useStageName ===
                                    true
                                  }
                                  onChange={(e) =>
                                    handleChangeInput(index, e.target.value)
                                  }
                                />
                                <label
                                  htmlFor={`stageName-${artist?._id}-${index}`}
                                >
                                  Nghệ danh
                                </label>
                                <input
                                  className="size-[14px] accent-black"
                                  id={`realName-${artist?._id}-${index}`}
                                  type="radio"
                                  title="Tên thật"
                                  value={"false"}
                                  checked={
                                    selectedArtists[index]?.useStageName ===
                                    false
                                  }
                                  onChange={(e) =>
                                    handleChangeInput(index, e.target.value)
                                  }
                                />
                                <label
                                  htmlFor={`realName-${artist?._id}-${index}`}
                                >
                                  Tên thật
                                </label>
                                <div className="cursor-pointer text-white-06 hover:text-white ml-2 border-border border-l">
                                  <FaTrash
                                    size={20}
                                    onClick={() => {
                                      setValueArtists((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                      setSelectedArtists((prev) =>
                                        prev.filter((_, i) => i !== index)
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  <div className="flex gap-4 w-full bg-base">
                    <div className="flex w-full gap-4 bg-base">
                      <DatePicker
                        className="!w-full"
                        label="Ngày phát hành"
                        value={info.releaseDay}
                        onChange={(value) => handleChange("releaseDay", value)}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            height: "48px", // Đặt chiều cao
                          },
                          "& .MuiTextField-root": {
                            width: "100% !important",
                          },
                          "& .MuiInputBase-input": {
                            padding: "14px", // Điều chỉnh padding để căn giữa văn bản
                            color: "rgb(255 255 255 / 0.6)",
                          },
                          "& .MuiInputLabel-root": {
                            color: "rgb(255 255 255 / 0.6)",
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
                            backgroundColor: "black !important",
                          },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                            {
                              borderColor: "white !important",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input":
                            {
                              color: "white !important",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root":
                            {
                              color: "white !important",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiInputLabel-root":
                            {
                              color: "white !important",
                            },
                          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline legend":
                            {
                              color: "white !important",
                            },
                        }}
                      />

                      <SelectSearchable
                        value={optionGenres.filter((option) =>
                          info.genres.includes(option.value)
                        )}
                        title="Thể loại"
                        data={optionGenres}
                        onChange={
                          (selected) =>
                            handleChange(
                              "genres",
                              selected.map((item) => item.value)
                            ) // ✅ Correct
                        }
                      />
                    </div>
                  </div>
                  <div className="w-full flex-1 flex flex-col gap-3">
                    {/* <InputFileUpload
              setInfo={setInfo}
              info={info}
              trackUpload={trackUpload}
            /> */}
                    <UploadFile
                      reset={resetFileImage}
                      title="Upload Image"
                      accept="image"
                      onChange={(file) => handleChange("img", file)}
                    />
                    <UploadFile
                      reset={resetFileVideo}
                      title="Upload Video"
                      accept="video"
                      onChange={(file) => handleChange("video", file)}
                    />
                  </div>
                </div>

                <div
                  className="flex justify-end mt-3"
                  onClick={() => handleSubmit()}
                >
                  <Button
                    className="cursor-pointe"
                    status={status}
                    setStatus={setStatus}
                    title="Tạo mới"
                  ></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
