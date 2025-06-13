import { sendRequestFile } from "@/api/api";
import { api_files, backendUrl } from "@/api/url";

export const uploadFile = async (
  file: File | null,
  folderType: string,
  access_token: string
) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  const res = await sendRequestFile<
    IBackendRes<{ fileName: string; mimeType: string }>
  >({
    url: `${backendUrl}${api_files.upload}`,
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${access_token}`,
      folder_type: folderType,
      delay: 1000,
    },
  });

  return res.data;
};
