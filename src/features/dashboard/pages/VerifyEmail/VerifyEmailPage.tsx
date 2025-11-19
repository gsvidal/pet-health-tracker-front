import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../../../../hooks/useVerifyEmail';
import toast from 'react-hot-toast';

export const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail, loading, successMessage, errorMessage } =
    useVerifyEmail();

  useEffect(() => {
    if (token) verifyEmail(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (successMessage) toast.success(successMessage);
    if (errorMessage) toast.error(errorMessage);
  }, [successMessage, errorMessage]);

  if (!token) return <p>Token inválido.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Verificando email...</h2>
      {loading && <p>Procesando…</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};
