// src/lib/features/tooltip/tooltip.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TooltipPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "center";

export interface TooltipData {
  content: string | React.ReactNode;
  position: TooltipPosition;
  anchorRect: DOMRect;
}

interface TooltipState {
  tooltip: TooltipData | null;
}

const initialState: TooltipState = {
  tooltip: null,
};

const tooltipSlice = createSlice({
  name: "tooltip",
  initialState,
  reducers: {
    showTooltip: (state, action: PayloadAction<TooltipData>) => {
      state.tooltip = action.payload;
    },
    hideTooltip: (state) => {
      state.tooltip = null;
    },
  },
});

export const { showTooltip, hideTooltip } = tooltipSlice.actions;
export default tooltipSlice.reducer;
