import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector((state) => state.auth.user);
  const userName = user?.name;

  return <AppHeaderUI userName={userName} />;
};
