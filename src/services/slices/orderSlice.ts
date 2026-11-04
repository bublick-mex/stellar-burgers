import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';

import type { SerializedError } from '@reduxjs/toolkit';
import type { TOrder } from '@utils-types';

type OrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  error: SerializedError | null;
};

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  error: null,
};

export const getOrderByNumber = createAsyncThunk(
  'order/getOrderByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const res = getOrderByNumberApi(number);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderBurger = createAsyncThunk(
  'order/orderBurger',
  async (data: string[], { rejectWithValue }) => {
    try {
      const res = await orderBurgerApi(data);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload.orders[0] || null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error;
      });
  },
});

export const { clearOrderModalData } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
