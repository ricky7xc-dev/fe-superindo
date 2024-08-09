// redux/slices/productCategoriesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProductCategory {
  id: number;
  name: string;
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

interface ProductCategoriesState {
  data: ProductCategory[];
  status: string | null;
  current_page: number;
  last_page: number;
  links: PaginationLink[];
  loading: boolean;
  error: string | null;
  success: string | null;
  editingCategory: ProductCategory | null;
}

const initialState: ProductCategoriesState = {
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

export const fetchProductCategoriesAll = createAsyncThunk(
  "productCategories/fetchProductCategoriesAll",
  async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories_all`
    );
    const data = await response.json();
    return data;
  }
);

export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetchProductCategories",
  async (page: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

export const addProductCategory = createAsyncThunk(
  "productCategory/addProductCategory",
  async (
    categoryData: { name: string; active: boolean; created_user: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories`,
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

export const updateProductCategory = createAsyncThunk(
  "productCategories/updateProductCategory",
  async (category: {
    id: number;
    name: string;
    active: boolean;
    updated_user: string;
  }) => {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/${category.id}`,
      category
    );
    return response.data;
  }
);

export const deleteProductCategory = createAsyncThunk(
  "productCategories/deleteProductCategory",
  async (id: number) => {
    await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/product_categories/${id}`
    );
    return id;
  }
);

const productCategoriesSlice = createSlice({
  name: "productCategories",
  initialState,
  reducers: {
    setEditingProductCategory(state, action) {
      state.editingCategory = action.payload;
    },
    clearMessages: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductCategories.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductCategories.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchProductCategories.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchProductCategoriesAll.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProductCategoriesAll.fulfilled, (state, action) => {
      state.data = action.payload;
      state.status = "succeeded";
    });
    builder.addCase(fetchProductCategoriesAll.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(addProductCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(addProductCategory.fulfilled, (state, action) => {
      state.loading = false;
      state.success = action.payload.message;
    });
    builder.addCase(addProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(updateProductCategory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductCategory.fulfilled, (state, action) => {
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
    builder.addCase(updateProductCategory.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message || "Failed to update product category.";
    });
    builder.addCase(deleteProductCategory.fulfilled, (state, action) => {
      state.data = state.data.filter((cat) => cat.id !== action.payload);
      state.status = "succeeded";
    });
  },
});

export const { setEditingProductCategory, clearMessages } =
  productCategoriesSlice.actions;
export default productCategoriesSlice.reducer;
