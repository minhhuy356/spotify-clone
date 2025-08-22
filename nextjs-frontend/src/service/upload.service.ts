import { sendRequestFile } from "@/api/api";
import { api_files, backendUrl } from "@/api/url";

export const getMediaDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = document.createElement("audio");

    audio.preload = "metadata";
    audio.src = url;

    audio.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(audio.duration); // thời lượng tính bằng giây
    };

    audio.onerror = () => {
      reject("Cannot load audio file");
    };
  });
};

export const uploadFile = async (
  file: File | null,
  folderType: string,
  access_token: string
): Promise<{
  fileName: string;
  mimeType: string;
  duration?: number;
} | null> => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  // Nếu là audio hoặc video thì lấy duration
  let duration: number | undefined = undefined;
  if (file.type.startsWith("audio") || file.type.startsWith("video")) {
    try {
      duration = await getMediaDuration(file);
    } catch (err) {
      console.warn("Could not get duration:", err);
    }
  }

  const res = await sendRequestFile<
    IBackendRes<{ fileName: string; mimeType: string }>
  >({
    url: `${backendUrl}${api_files.upload}`,
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${access_token}`,
      folder_type: folderType,
    },
  });
  const data = res.data ? { ...res.data, duration } : null;
  console.log(data);
  return data;
};
