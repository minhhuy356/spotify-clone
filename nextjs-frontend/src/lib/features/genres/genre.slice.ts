import { api_genres, backendUrl, url_api_genres } from "@/api/url";
import { RootState } from "@/lib/store";
import { IGenres } from "@/types/data";
import { sendRequest } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IGenrestate {
  isPending: boolean;
  isError: boolean;
  listGenres: IGenres[];
  error: any;
}

// Define the initial state using that type
const initialState: IGenrestate = {
  isPending: false,
  isError: false,
  listGenres: [],
  error: [],
};

// Define the login action
export const fetchAllGenres = createAsyncThunk<IGenres[]>(
  "artist/type-detail",
  async (credentials, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST với thông tin username và password
      const response = await sendRequest<
        IBackendRes<IModelPaginate<IGenres[]>>
      >({
        url: `${backendUrl}${url_api_genres}`,
        method: "GET",
      });

      // Trả về dữ liệu người dùng nếu thành công
      if (response.data) {
        return response.data.result; // Trả về IUser
      }

      // Nếu không có dữ liệu trả về, bạn có thể trả về rejectWithValue
      return rejectWithValue("Không có dữ liệu!");
    } catch (error) {
      // Trả về thông báo lỗi nếu có lỗi
      return rejectWithValue("Tải dữ liệu thất bại");
    }
  }
);

export const GenreSlice = createSlice({
  name: "genre",
  initialState,
  reducers: {
    // GenresOnWave(state, action) {
    //   state.isGenres = !action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGenres.pending, (state) => {
        state.isPending = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAllGenres.fulfilled, (state, action) => {
        state.isPending = false;
        state.listGenres = action.payload; // Store the user data
        state.error = null; // Clear the error on success
      })
      .addCase(fetchAllGenres.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string; // Set error message from rejectWithValue
      });
  },
});

export const {} = GenreSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectListGenres = (state: RootState) => state.genre.listGenres;
export const selectIsPending = (state: RootState) => state.genre.isPending;
export const selectIsError = (state: RootState) => state.genre.isError;
export default GenreSlice.reducer;
