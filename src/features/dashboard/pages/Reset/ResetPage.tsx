import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import ResetPasswordForm from '../../../auth/ResetPasswordForm';
import './ResetPage.scss';

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const token = params.get('token');
  if (!token) {
    return (
      <div className="reset-container">
        <h2 className="title">{t('common.error')}</h2>
        <p className="server-error">
          {t('auth.verifyEmail.invalidTokenMessage')}
        </p>
      </div>
    );
  }
  return (
    <div className="page-wrapper flex-center">
      <ResetPasswordForm token={token} />
    </div>
  );
};

export default ResetPasswordPage;
