import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ISeekState {
  isSeeking: boolean;
}

// Define the initial state using that type
const initialState: ISeekState = {
  isSeeking: false,
};

export const seekSlice = createSlice({
  name: "seek",
  initialState,
  reducers: {
    seekingOnWave(state, action) {
      state.isSeeking = !action.payload;
    },
  },
});

export const { seekingOnWave } = seekSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectIsSeek = (state: RootState) => state.seek.isSeeking;

export default seekSlice.reducer;
