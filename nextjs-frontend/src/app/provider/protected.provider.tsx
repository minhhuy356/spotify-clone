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
import { access } from "fs";

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
    if (!session || !session.access_token) {
      console.log("⚠️ Không tìm thấy access token, dừng kiểm tra.");
      return;
    }

    const oneHour = 3600;
    const decodedAccess = jwt.decode(session.access_token) as {
      exp: number;
    } | null;

    if (!decodedAccess) {
      console.log("❌ Access token không hợp lệ. Bắt buộc đăng nhập lại.");
      logout();
      router.push("/auth/signin");
      return;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const accessExpiry = decodedAccess.exp;

    if (currentTime >= accessExpiry - oneHour) {
      console.log("🔄 Access token sắp hết hạn, thực hiện refresh...");

      try {
        // Gửi access token để lấy access token mới
        const res = await getNewAccessToken();

        if (!res.ok) throw new Error("Lỗi khi refresh token");

        const data = await res.json();
        if (data?.access_token) {
          const newSession = { ...session, access_token: data.access_token };

          dispatch(setSession(newSession));
          localStorage.setItem("session", JSON.stringify(newSession));
          console.log("✅ Token refreshed successfully!");
        }
      } catch (error) {
        console.log("❌ Token refresh failed, forcing re-login");
        logout();
        router.push("/auth/signin");
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

  return <>{children}</>;
};

export default ProtectedPage;
