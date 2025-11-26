import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useVerifyEmail } from '../../../../hooks/useVerifyEmail';
import toast from 'react-hot-toast';
import { PUBLIC_ROUTES } from '../../../../config/routes';

export const VerifyEmailPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { verifyEmail, loading, successMessage, errorMessage } =
    useVerifyEmail();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) verifyEmail(token);
    console.log('token from verify email page.tsx: ', token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      const id = setTimeout(() => {
        navigate(PUBLIC_ROUTES.LOGIN);
      }, 10000);
      return () => {
        clearTimeout(id);
      }
    }
    if (errorMessage) toast.error(errorMessage);
  }, [successMessage, errorMessage]);

  if (!token) return <p>Token inválido.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Verificando email...</h2>
      {loading && <p>Procesando…</p>}
      {/* {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} */}
      <p>Redireccionando...</p>
    </div>
  );
};
