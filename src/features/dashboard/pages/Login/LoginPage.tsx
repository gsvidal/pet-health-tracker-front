import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/Modal/Modal';
import { LoginForm } from '../../../auth/LoginForm';
import './LoginPage.scss'

export const LoginPage = () => {
  const [openLogin, setOpenLogin] = useState(true);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpenLogin(false);
    navigate('/');
  };
  return (
    <div className='login-page'>
      <Modal isOpen={openLogin} onClose={handleClose}>
        <LoginForm />
      </Modal>
    </div>
  );
};
