"use client";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { sendRequest } from "@/api/api";

import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsPending,
  selectSession,
  setSession,
  setSessionActivity,
} from "@/lib/features/auth/auth.slice";
import { api_auth, backendUrl } from "@/api/url";
import {
  getNewAccessToken,
  getRefreshToken,
  logoutService,
} from "@/lib/features/auth/auth.service";
import ContextMenuTrack from "@/components/context-menu/context-menu.track";
import ContextMenuArtist from "@/components/context-menu/context-menu.artist";
import { selectTemporaryArtist } from "@/lib/features/local/local.slice";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const session = useAppSelector(selectSession);
  const isPending = useAppSelector(selectIsPending);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client side
    const disableContextMenu = (event: MouseEvent) => event.preventDefault();

    document.addEventListener("contextmenu", disableContextMenu);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
    };
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    }

    checkAndRefreshToken();
  }, [session]);

  const logout = () => {
    if (session) {
      logoutService(session);
      dispatch(setSession(null));
      localStorage.removeItem("session");
      window.location.reload();
    }
  };

  const checkAndRefreshToken = async () => {
    if (!session) {
      console.log("⚠️ Không tìm thấy token, dừng kiểm tra.");
      return;
    }

    const oneDay = 86400;
    const oneHour = 3600;

    // Giải mã access token
    const decodedAccess = jwt.decode(session.access_token) as {
      exp: number;
    } | null;

    // Giải mã refresh token
    const refresh_token = await getRefreshToken(session.access_token);

    const decodedRefresh = jwt.decode(refresh_token) as {
      exp: number;
    } | null;

    if (!decodedAccess || !decodedRefresh) {
      console.log("❌ Không thể giải mã token. Bắt buộc đăng nhập lại.");
      logout();
      router.push("/auth/signin"); // Bắt buộc đăng nhập lại nếu token không hợp lệ
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Lấy thời gian hiện tại (seconds)
    const accessExpiry = decodedAccess.exp; // Thời gian hết hạn của access token
    const refreshExpiry = decodedRefresh.exp; // Thời gian hết hạn của refresh token

    if (currentTime >= refreshExpiry - oneDay) {
      console.log("❌ Refresh token hết hạn. Bắt buộc đăng nhập lại.");
      logout();
      router.push("/auth/signin"); // Yêu cầu đăng nhập lại nếu refresh token hết hạn
      return;
    }

    if (currentTime >= accessExpiry - oneHour) {
      console.log("🔄 Access token hết hạn, thực hiện refresh...");

      try {
        const res = await getNewAccessToken();

        if (res?.data?.result) {
          const session = res.data.result;

          dispatch(setSession(session));
          localStorage.setItem("session", JSON.stringify(session));
          console.log("✅ Token refreshed successfully, updating session...");
        }
      } catch (error) {
        console.log("❌ Token refresh failed, forcing re-login");
        // router.push("/auth/signin");
      }
    }
  };

  useEffect(() => {
    checkLocalStorage();
  }, []);

  const checkLocalStorage = () => {
    const session = JSON.parse(localStorage.getItem("session") || "null");

    if (session) {
      dispatch(setSession(session));
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <CircularProgress />
      </div>
    );
  }

  // if (!session) {
  //   router.push("/auth/signin");
  // }

  return (
    <>
      {children}
      <ContextMenuTrack />
      <ContextMenuArtist />
    </>
  );
};

export default ProtectedPage;
