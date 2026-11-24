import {
  constructorReducer,
  addIngredients,
  removeConstructorIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from '../constructorSlice';
import { orderBurger } from '../orderSlice';

import type { TConstructorIngredient, TIngredient } from '@/utils/types';

const mockBun: TIngredient = {
  _id: 'bun-1',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
};

const mockMainFirst: TIngredient = {
  _id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
};

const mockSauceSecond: TIngredient = {
  _id: 'sauce-2',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
};

describe('проверка редьюсера слайса конструктора бургера', () => {
  it('должен возвращать начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('должен добавлять булку в поле bun и присваивать уникальный id', () => {
    const action = addIngredients(mockBun);
    const state = constructorReducer(undefined, action);

    expect(state.bun).toMatchObject(mockBun);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.bun?.id).toBeTruthy();
    expect(state.ingredients).toEqual([]);
  });

  it('должен добавлять начинку/соус в массив ingredients', () => {
    const state = constructorReducer(undefined, addIngredients(mockMainFirst));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(mockMainFirst);
    expect(typeof state.ingredients[0]?.id).toBe('string');
    expect(state.bun).toBeNull();
  });

  it('должен удалять ингредиент из массива ingredients по id', () => {
    const first: TConstructorIngredient = { ...mockMainFirst, id: 'id-1' };
    const second: TConstructorIngredient = { ...mockSauceSecond, id: 'id-2' };

    const state = constructorReducer(
      { bun: null, ingredients: [first, second] },
      removeConstructorIngredient('id-1')
    );

    expect(state.ingredients).toEqual([second]);
  });

  it('должен перемещать ингредиент вверх по списку начинок', () => {
    const first: TConstructorIngredient = { ...mockMainFirst, id: 'id-1' };
    const second: TConstructorIngredient = { ...mockSauceSecond, id: 'id-2' };

    const state = constructorReducer(
      { bun: null, ingredients: [first, second] },
      moveIngredientUp(1)
    );

    expect(state.ingredients).toEqual([second, first]);
  });

  it('должен перемещать ингредиент вниз по списку начинок', () => {
    const first: TConstructorIngredient = { ...mockMainFirst, id: 'id-1' };
    const second: TConstructorIngredient = { ...mockSauceSecond, id: 'id-2' };

    const state = constructorReducer(
      { bun: null, ingredients: [first, second] },
      moveIngredientDown(0)
    );

    expect(state.ingredients).toEqual([second, first]);
  });

  it('должен очищать конструктор при вызове clearConstructor', () => {
    const state = constructorReducer(
      {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockMainFirst, id: 'id-1' }],
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('должен очищать конструктор при успешном оформлении заказа (orderBurger.fulfilled)', () => {
    const state = constructorReducer(
      {
        bun: { ...mockBun, id: 'bun-id' },
        ingredients: [{ ...mockMainFirst, id: 'id-1' }],
      },
      {
        type: orderBurger.fulfilled.type,
        payload: { order: { number: 12345 }, name: 'Бургер', success: true },
      }
    );

    expect(state).toEqual({
      bun: null,
      ingredients: [],
    });
  });
});
