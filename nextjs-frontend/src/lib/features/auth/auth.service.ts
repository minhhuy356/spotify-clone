import { api_auth, backendUrl } from "@/api/url";
import { sendRequest } from "@/api/api";
import { IAuth, IUser } from "@/types/data";

export const loginService = async (username: string, password: string) => {
  try {
    const response: any = await fetch(
      "http://localhost:8080/api/v1/auth/login",
      {
        method: "POST",
        credentials: "include", // ✅ Giúp trình duyệt lưu cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    if (response) {
      // delete response.data.refresh_token;
      const res = await response.json();
      return res.data;
    }
  } catch (error) {
    throw new Error("Đăng nhập thất bại");
  }
};

export const logoutService = async (session: IAuth) => {
  try {
    const response: any = await fetch(`${backendUrl}${api_auth.logout}`, {
      method: "POST",
      credentials: "include", // ✅ Giúp trình duyệt lưu cookie
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (response) {
      const res = await response.json();
      return res.data;
    }

    throw new Error("Không có dữ liệu người dùng");
  } catch (error) {
    throw new Error("Đăng nhập thất bại");
  }
};

export const getNewAccessToken = async () => {
  try {
    const response: any = await fetch(`${backendUrl}${api_auth.refresh}`, {
      method: "POST",
      credentials: "include", // ✅ Giúp trình duyệt lưu cookie
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response) {
      const res = await response.json();
      return res.data;
    }

    throw new Error("Không có dữ liệu người dùng");
  } catch (error) {
    throw new Error("Đăng nhập thất bại");
  }
};
export const getRefreshToken = async (access_token: string) => {
  try {
    const response: any = await fetch(`${backendUrl}${api_auth.refresh}`, {
      method: "GET",
      credentials: "include", // ✅ Giúp trình duyệt lưu cookie
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (response) {
      const res = await response.json();

      return res.data.refreshToken;
    }

    throw new Error("Không có dữ liệu người dùng");
  } catch (error) {
    throw new Error("Đăng nhập thất bại");
  }
};
