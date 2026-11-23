import { getProfileOrders } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { userOrders, isLoading } = useSelector((state) => state.feed);

  useEffect(() => {
    void dispatch(getProfileOrders());
  }, [dispatch]);

  if (isLoading || !userOrders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrders} />;
};
