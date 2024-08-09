// store/slices/imageSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ImageState {
  imageLocation: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  imageLocation: null,
  loading: false,
  error: null,
};

export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (imageData: FormData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload_image`,
        imageData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.image_location;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'An error occurred');
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageLocation = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default imageSlice.reducer;
