// redux/slices/productVariantSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductVariant {
  id: number;
  name: string;
  code: string;
  product_id: number;
  qty: number;
  price: string;
  image_location: string;
  active: boolean;
  created_user: string;
  created_date: string;
  updated_user: string;
  updated_date: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface ProductVariantState {
  data: ProductVariant[];
  status: string | null;
  current_page: number;
  last_page: number;
  links: PaginationLink[];
  loading: boolean;
  error: string | null;
  success: string | null;
  editingCategory: ProductVariant | null;
}

const initialState: ProductVariantState = {
  data: [],
  status: null,
  current_page: 1,
  last_page: 1,
  links: [],
  loading: false,
  error: null,
  success: null,
  editingCategory: null,
};

interface FetchProductVariantIdArgs {
  productId: number;
  page: number;
}

export const fetchProductVariant = createAsyncThunk(
  "products/fetchProductVariant",
  async (page: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_variants?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchProductVariantId = createAsyncThunk(
  "products/fetchProductVariantId",
  async ({ productId, page }: FetchProductVariantIdArgs) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_variants_get/${productId}?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

export const addProductVariant = createAsyncThunk(
  "productVariants/addProductVariants",
  async (
    categoryData: {
      code: string;
      name: string;
      price: string;
      image_location: string;
      product_id: number;
      qty: number;
      active: boolean;
      created_user: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product_variants`,
        categoryData
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data.message || "An error occurred"
        );
      }
      return rejectWithValue("An error occurred");
    }
  }
);

const productVariantSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setEditingProductVariant(state, action) {
      state.editingCategory = action.payload;
    },
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProductVariant.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(addProductVariant.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(addProductVariant.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchProductVariant.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductVariant.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchProductVariant.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchProductVariantId.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductVariantId.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchProductVariantId.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { setEditingProductVariant, clearMessages } =
  productVariantSlice.actions;
export default productVariantSlice.reducer;
