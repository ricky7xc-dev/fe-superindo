// store/cartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Cart {
  id: number;
  product_variant_id: number;
  user_id: number;
  quantity: number;
  status: string;
  name: string;
  total_quantity: number;
  total_amount: number;
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

interface CartState {
  data: Cart[];
  status: string | null;
  current_page: number;
  last_page: number;
  total: number;
  links: PaginationLink[];
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  data: [],
  status: null,
  current_page: 1,
  last_page: 1,
  total: 1,
  links: [],
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (page: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

// export const fetchVwCart = createAsyncThunk(
//     "cart/fetchVwCart",
//     async (page: number) => {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart_vw?page=${page}`
//       );
//       const data = await response.json();
//       return data;
//     }
//   );

export const fetchVwCart = createAsyncThunk(
  "cart/fetchVwCart",
  async ({ userId, page = 1 }: { userId: number; page?: number }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart_vw`,
      {
        user_id: userId,
        page: page,
      }
    );
    return response.data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({
    userId,
    productId,
    quantity,
  }: {
    userId: number;
    productId: number;
    quantity: number;
  }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/cart`,
      {
        user_id: userId,
        product_variant_id: productId,
        qty: quantity,
        status: "cart",
      }
    );
    return response.data;
  }
);

export const fetchVwInvoice = createAsyncThunk(
  "invoice/fetchVwInvoice",
  async ({ userId, page = 1 }: { userId: number; page?: number }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/checkout_vw`,
      {
        user_id: userId,
        page: page,
      }
    );
    return response.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCart.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to add to cart";
    });
    builder.addCase(fetchCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.total = action.payload.total;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchVwCart.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchVwCart.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.total = action.payload.total;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchVwCart.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchVwInvoice.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchVwInvoice.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.total = action.payload.total;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchVwInvoice.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default cartSlice.reducer;
