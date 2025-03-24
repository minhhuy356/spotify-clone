"use client";

import AppFooter from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import Left from "@/components/main/main.left";
import Right from "@/components/main/right/main.right";
import ScrollBar from "@/components/scroll/scroll";
import { ITrack } from "@/types/data";
import React from "react";

import "@/app/globals.css";
import { StoreProvider } from "./provider/store.provider";
import ProtectedPage from "./provider/protected.provider";

interface ILayout {
  left: IPosition;
  right: number;
  center: number;
}

interface IPosition {
  width: number;
  isClose: boolean;
}
const gap = 4;
const widthDrag = 2;
const px = 16;
const space = gap * 4 + widthDrag * 2 + px;

const minLeftWidth = 72;
const minRightWidth = 40;
const hardLeftWidth = 280;
const hardCenterWidth = 424;
const hardRightWidth = 280;
const maxLeftWidthMobileScreen = 400;
const maxLeftWidth = 450;
const ultimateLeftWidth = 600;
const maxRightWidth = 420;

export {
  gap,
  widthDrag,
  px,
  space,
  minLeftWidth,
  minRightWidth,
  hardLeftWidth,
  hardCenterWidth,
  hardRightWidth,
  maxLeftWidthMobileScreen,
  maxLeftWidth,
  ultimateLeftWidth,
  maxRightWidth,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <ProtectedPage>{children}</ProtectedPage>
        </StoreProvider>
      </body>
    </html>
  );
}
