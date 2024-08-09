// redux/slices/productsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  plu: string;
  category_name: string;
  status_product: string;
  variant_count: number;
  product_category_id: number;
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

interface ProductState {
  data: Product[];
  status: string | null;
  current_page: number;
  last_page: number;
  links: PaginationLink[];
  loading: boolean;
  error: string | null;
  success: string | null;
  editingCategory: Product | null;
}

const initialState: ProductState = {
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

export const fetchProduct = createAsyncThunk(
  "products/fetchProduct",
  async (page: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_vw?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

export const addProduct = createAsyncThunk(
  "productCategory/addProduct",
  async (
    categoryData: {
      plu: string;
      name: string;
      product_category_id: number;
      active: boolean;
      created_user: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product`,
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

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (category: {
    id: number;
    plu: string;
    name: string;
    product_category_id: number;
    active: boolean;
    updated_user: string;
  }) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product/${category.id}`,
      category
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: number) => {
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/product/${id}`);
    return id;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setEditingProduct(state, action) {
      state.editingCategory = action.payload;
    },
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProduct.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchProduct.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
      const updatedCategory = action.payload.data;
      const index = state.data.findIndex(
        (category) => category.id === updatedCategory.id
      );
      if (index !== -1) {
        state.data[index] = updatedCategory;
      }
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to update product category.";
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.data = state.data.filter((cat) => cat.id !== action.payload);
      state.status = "succeeded";
    });
  },
});

export const { setEditingProduct, clearMessages } = productsSlice.actions;
export default productsSlice.reducer;
