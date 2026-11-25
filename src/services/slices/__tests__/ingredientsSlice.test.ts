import { ingredientReducer, fetchIngredients } from '../ingredientsSlice';

import type { TIngredient } from '@/utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  },
];

describe('проверка редьюсера слайса ингредиентов', () => {
  it('должен возвращать начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = ingredientReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      ingredients: [],
      isIngredientsLoading: false,
      ingredientsError: null,
    });
  });

  it('должен устанавливать isIngredientsLoading в true и сбрасывать ошибку при fetchIngredients.pending', () => {
    const prevState = {
      ingredients: [],
      isIngredientsLoading: false,
      ingredientsError: { message: 'Предыдущая ошибка' },
    };

    const state = ingredientReducer(prevState, {
      type: fetchIngredients.pending.type,
    });

    expect(state.isIngredientsLoading).toBe(true);
    expect(state.ingredientsError).toBeNull();
  });

  it('должен сохранять ингредиенты и сбрасывать isIngredientsLoading при fetchIngredients.fulfilled', () => {
    const state = ingredientReducer(
      {
        ingredients: [],
        isIngredientsLoading: true,
        ingredientsError: null,
      },
      {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients,
      }
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredientsError).toBeNull();
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен сохранять ошибку и сбрасывать isIngredientsLoading при fetchIngredients.rejected', () => {
    const error = { message: 'Ошибка загрузки ингредиентов' };

    const state = ingredientReducer(
      {
        ingredients: [],
        isIngredientsLoading: true,
        ingredientsError: null,
      },
      {
        type: fetchIngredients.rejected.type,
        error,
      }
    );

    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredientsError).toEqual(error);
  });
});
