"use client";
import Link from "next/link";
import { AppBar, Typography, Avatar } from "@mui/material";
import { useRouter } from "next/navigation";

import { FaRegBell } from "react-icons/fa";
import { motion } from "framer-motion";
import SearchCustom from "../input/admin/input.search";
import ContextMenuAccount from "../context-menu/context-menu.account";
import { useAppSelector } from "@/lib/hook";
import { selectSession } from "@/lib/features/auth/auth.slice";
import { useEffect, useRef, useState } from "react";
import { router_auth, router_url_auth } from "@/api/router";
import { frontendUrl } from "@/api/url";
import { useResponsiveBreakpoint } from "@/hooks/useResponsiveBreakpoint";

interface IProps {}

export default function AppHeader({}: IProps) {
  const session = useAppSelector(selectSession);
  const router = useRouter();
  const [contextMenuAccountOpen, setContextMenuAccountOpen] = useState(false); // Trạng thái menu
  const avatarRef = useRef<HTMLDivElement | null>(null);

  const { ref: wrapperRef, breakpoint } = useResponsiveBreakpoint();

  const handleRedirectHome = () => {
    router.push("/");
  };

  const [callbackUrl, setCallbackUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCallbackUrl(window.location.pathname);
    }
  }, []);

  return (
    <>
      <div className="bg-inherit" ref={wrapperRef}>
        <div className="my-2">
          <div className={`flex px-4 justify-between gap-4`}>
            {breakpoint.below1400 ? (
              <div className="flex gap-8 flex-1">
                <div className="flex items-center px-4 cursor-pointer">
                  <div
                    onClick={handleRedirectHome}
                    className="text-white text-3xl"
                  >
                    NEXT
                  </div>
                </div>
                <div className="max-w-[480px] w-full">
                  <SearchCustom />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center px-4 cursor-pointer">
                  <div
                    onClick={handleRedirectHome}
                    className="text-white text-3xl"
                  >
                    NEXT
                  </div>
                </div>
                <div className="max-w-[480px] w-full">
                  <SearchCustom />
                </div>
              </>
            )}

            <div className="flex gap-3 items-center justify-end ">
              {session ? (
                <div className="flex">
                  <motion.div
                    className="p-3 rounded-full text-white-06 hover:text-white cursor-pointer"
                    whileHover={{
                      scale: 1.2,
                      rotate: [0, -10, 10, -10, 10, 0],
                      transition: { duration: 0.5, ease: "easeInOut" },
                    }}
                  >
                    <FaRegBell />
                  </motion.div>
                  <div className="relative" ref={avatarRef}>
                    <Avatar
                      className="cursor-pointer"
                      onClick={() =>
                        setContextMenuAccountOpen(!contextMenuAccountOpen)
                      }
                    >
                      {session.user.email[0]}
                    </Avatar>
                    <ContextMenuAccount
                      isOpen={contextMenuAccountOpen}
                      setIsOpen={setContextMenuAccountOpen}
                      anchorRef={avatarRef}
                    />
                  </div>
                </div>
              ) : (
                <Link
                  href={`${frontendUrl}${router_auth}${router_url_auth.signin}?callbackUrl=${callbackUrl}`}
                  className="text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
