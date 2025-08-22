"use client";
import React, { useEffect } from "react";
import jwt from "jsonwebtoken";
import { sendRequest } from "@/api/api";

import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
  selectIsPending,
  selectIsSignin,
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
import ModalBackendError from "@/components/modal/modal.backend";

const ProtectedPage = ({ children }: { children: React.ReactNode }) => {
  const session = useAppSelector(selectSession);
  const isPending = useAppSelector(selectIsPending);
  const isSignin = useAppSelector(selectIsSignin);

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
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
      if (!isPending) router.push("/auth/signin");
      return;
    }

    const oneHour = 3600;
    const decodedAccess = jwt.decode(session.access_token) as {
      exp: number;
    } | null;

    if (!decodedAccess) {
      console.log("❌ Access token không hợp lệ. Bắt buộc đăng nhập lại.");
      logout();
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
        router.push("/auth/signin");
        const data = await res.json();
        if (data?.access_token) {
          const newSession = { ...session, access_token: data.access_token };

          dispatch(setSession(newSession));
          localStorage.setItem("session", JSON.stringify(newSession));
          console.log("✅ Token refreshed successfully!");
        }
      } catch (error) {
        if (!isPending) {
          router.push("/auth/signin");
          console.log("❌ Token refresh failed, forcing re-login");
          logout();
        }
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

  useEffect(() => {
    if (session) {
      localStorage.setItem("session", JSON.stringify(session));
      // Đánh dấu người dùng đã đăng nhập
    }
  }, [session]); // Mỗi khi session thay đổi, cập nhật vào localStorage

  return (
    <>
      {children}
      <ModalBackendError />
    </>
  );
};

export default ProtectedPage;
