import {
  api_artist_type_detail,
  api_artists,
  backendUrl,
  url_api_artist_type_detail,
  url_api_artists,
} from "@/api/url";
import { RootState } from "@/lib/store";
import { IArtist, IArtistTypeDetail } from "@/types/data";
import { sendRequest } from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IArtistState {
  isPending: boolean;
  isError: boolean;
  listArtist: IArtist[];
  listArtistTypeDetails: IArtistTypeDetail[];
  error: any;
}

// Define the initial state using that type
const initialState: IArtistState = {
  isPending: false,
  isError: false,
  listArtist: [],
  listArtistTypeDetails: [],
  error: [],
};

// Define the login action
export const fetchAllArtistTypeDetails = createAsyncThunk<IArtistTypeDetail[]>(
  "artist/artist-type-detail",
  async (credentials, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST với thông tin username và password
      const response = await sendRequest<
        IBackendRes<IModelPaginate<IArtistTypeDetail[]>>
      >({
        url: `${backendUrl}${url_api_artist_type_detail}`,
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

// Define the login action
export const fetchAllArtists = createAsyncThunk<IArtist[]>(
  "artist/artist",
  async (credentials, { rejectWithValue }) => {
    try {
      // Gửi yêu cầu POST với thông tin username và password
      const response = await sendRequest<
        IBackendRes<IModelPaginate<IArtist[]>>
      >({
        url: `${backendUrl}${url_api_artists}`,
        method: "GET",
      });
      console.log(response.data?.result);
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

export const ArtistSlice = createSlice({
  name: "artist",
  initialState,
  reducers: {
    // ArtistOnWave(state, action) {
    //   state.isArtist = !action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllArtistTypeDetails.pending, (state) => {
        state.isPending = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAllArtistTypeDetails.fulfilled, (state, action) => {
        state.isPending = false;
        state.listArtistTypeDetails = action.payload; // Store the user data
        state.error = null; // Clear the error on success
      })
      .addCase(fetchAllArtistTypeDetails.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string; // Set error message from rejectWithValue
      })

      .addCase(fetchAllArtists.pending, (state) => {
        state.isPending = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchAllArtists.fulfilled, (state, action) => {
        state.isPending = false;
        state.listArtist = action.payload; // Store the user data
        state.error = null; // Clear the error on success
      })
      .addCase(fetchAllArtists.rejected, (state, action) => {
        state.isPending = false;
        state.error = action.payload as string; // Set error message from rejectWithValue
      });
  },
});

export const {} = ArtistSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectListArtists = (state: RootState) => state.artist.listArtist;
export const selectListArtistTypeDetails = (state: RootState) =>
  state.artist.listArtistTypeDetails;
export const selectIsPending = (state: RootState) => state.artist.isPending;
export const selectIsError = (state: RootState) => state.artist.isError;
export default ArtistSlice.reducer;
