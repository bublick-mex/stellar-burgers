import { useSelector } from '@/services/store';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();
  const { ingredients } = useSelector((state) => state.ingredients);
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.feed?.userOrders);
  const modalOrder = useSelector((state) => state.order?.orderModalData);

  const orderData = useMemo(() => {
    if (modalOrder && modalOrder.number.toString() === number) {
      return modalOrder;
    }
    const allOrders = [...feedOrders, ...profileOrders];
    if (allOrders.length > 0) {
      return allOrders.find((item) => item.number.toString() === number);
    }
    return null;
  }, [number, modalOrder, feedOrders, profileOrders]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
