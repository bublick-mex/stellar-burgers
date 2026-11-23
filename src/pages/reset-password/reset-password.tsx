import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { SerializedError } from '@reduxjs/toolkit';

export const ResetPassword = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<SerializedError | null>(null);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    setError(null);
    void resetPasswordApi({ password, token })
      .then(() => {
        localStorage.removeItem('resetPassword');
        void navigate('/login');
      })
      .catch((err: unknown) => {
        const errorMessage =
          err instanceof Error ? err.message : 'Произошла ошибка при сбросе пароля';
        setError({ message: errorMessage });
      });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      void navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error?.message}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
