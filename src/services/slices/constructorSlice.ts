import { createSlice } from '@reduxjs/toolkit';

import { orderBurger } from './orderSlice';

import type { TConstructorIngredient, TIngredient } from '@/utils/types';
import type { PayloadAction } from '@reduxjs/toolkit';

type ConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredients: {
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: crypto.randomUUID() },
      }),
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
    },
    removeConstructorIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const movedItem = state.ingredients[index];
        state.ingredients.splice(index, 1);
        state.ingredients.splice(index - 1, 0, movedItem);
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        const movedItem = state.ingredients[index];
        state.ingredients.splice(index, 1);
        state.ingredients.splice(index + 1, 0, movedItem);
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurger.fulfilled, (state) => {
      state.bun = null;
      state.ingredients = [];
    });
  },
});

export const {
  addIngredients,
  removeConstructorIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} = constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
