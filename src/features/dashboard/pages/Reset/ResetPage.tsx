import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../../../auth/ResetPasswordForm';

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  if (!token) {
    return (
      <div className="reset-container">
        <h2 className="title">Error</h2>
        <p className="server-error">
          No se encontró un token válido. Por favor revisá tu correo y vuelve a
          intentarlo.
        </p>
      </div>
    );
  }
  return (
    <div className="page-wrapper">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
