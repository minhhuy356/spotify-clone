import { createAsyncThunk } from "@reduxjs/toolkit";

import { IAuth } from "@/types/data";
import { loginService, logoutService } from "./auth.service";

// Xử lý đăng nhập bằng createAsyncThunk
export const login = createAsyncThunk<
  IAuth,
  { username: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ username, password }, { rejectWithValue }) => {
  try {
    return await loginService(username, password);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logout = createAsyncThunk<
  { d: string }, // Đổi kiểu dữ liệu trả về
  { session: IAuth },
  { rejectValue: string }
>("auth/logout", async ({ session }, { rejectWithValue }) => {
  try {
    return await logoutService(session);
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});
