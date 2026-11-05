import { combineReducers } from '@reduxjs/toolkit';

import { authReduser } from './slices/authSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { ingredientReducer } from './slices/ingredientsSlice';
import { orderReducer } from './slices/orderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  auth: authReduser,
  constructorBurger: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
});
