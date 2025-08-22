import { api_auth, backendUrl } from "@/api/url";
import { cookies } from "next/headers";

export const getNewAccessTokenServer = async () => {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) return null;

    const response = await fetch(`${backendUrl}${api_auth.refresh}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    const res = await response.json();

    return res.data.access_token;
  } catch (error) {
    console.error("Đăng nhập bằng refresh token thất bại:", error);
    return null;
  }
};
