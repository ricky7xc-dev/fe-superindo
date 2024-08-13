// store/invoiceSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Invoice {
  id: number;
  code: number;
  user_id: number;
  quantity: number;
  status: string;
  address: string;
  payment_method: string;
  payment_proof: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
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

interface InvoiceState {
  data: Invoice[];
  status: string | null;
  current_page: number;
  last_page: number;
  total: number;
  links: PaginationLink[];
  loading: boolean;
  success: boolean | null;
  error: string | null;
  editingCategory: Invoice | null;
}

const initialState: InvoiceState = {
  data: [],
  status: null,
  current_page: 1,
  last_page: 1,
  total: 1,
  links: [],
  loading: false,
  success: false,
  error: null,
  editingCategory: null,
};

export const createInvoice = createAsyncThunk(
  "invoice/createInvoice",
  async ({
    userId,
    firstName,
    lastName,
    addressSub,
    phoneNumber,
    emailSub,
    paymentProof,
    paymentMethod,
    created_user,
  }: {
    userId: number;
    firstName: string;
    lastName: string;
    addressSub: string;
    phoneNumber: string;
    emailSub: string;
    paymentProof: string;
    paymentMethod: string;
    created_user: string;
  }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/checkout/${userId}`,
        {
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          address: addressSub,
          phone_number: phoneNumber,
          email: emailSub,
          payment_proof: paymentProof,
          payment_method: paymentMethod,
          created_user: created_user,
          status: "Menunggu Konfirmasi",
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          success: false,
          error: error.message || "Failed to create invoice",
        };
      }
      return { success: false, error: "An unexpected error occurred" };
    }
  }
);

export const getInvoice = createAsyncThunk(
  "invoice/getInvoice",
  async ({ userId, page = 1 }: { userId: number; page?: number }) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoice_vw`,
      {
        user_id: userId,
        page: page,
      }
    );
    return response.data;
  }
);

export const fetchInvoice = createAsyncThunk(
  "invoice/fetchInvoice",
  async (page: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/invoice_all?page=${page}`
    );
    const data = await response.json();
    return data;
  }
);

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    setDetailInvoice(state, action) {
      state.editingCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createInvoice.pending, (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    });
    builder.addCase(createInvoice.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.success) {
        state.success = true;
      } else {
        state.success = false;
        state.error = action.payload.error || "Failed to create invoice";
      }
    });
    builder.addCase(createInvoice.rejected, (state, action) => {
      state.loading = false;
      state.success = false;
      // Check if action.error is an instance of Error
      if (action.error && action.error.message) {
        state.error = action.error.message;
      } else {
        state.error = "Failed to create invoice";
      }
    });
    builder.addCase(getInvoice.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = null;
    });
    builder.addCase(getInvoice.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.loading = false;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
      state.success = action.payload.message;
    });
    builder.addCase(getInvoice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    builder.addCase(fetchInvoice.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchInvoice.fulfilled, (state, action) => {
      state.data = action.payload.data;
      state.current_page = action.payload.current_page;
      state.last_page = action.payload.last_page;
      state.links = action.payload.links;
      state.status = "succeeded";
    });
    builder.addCase(fetchInvoice.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { setDetailInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
