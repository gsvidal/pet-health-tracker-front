import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../../components/Modal/Modal';
import { LoginForm } from '../../../auth/LoginForm';

export const LoginPage = () => {
  const [openLogin, setOpenLogin] = useState(true);
  const navigate = useNavigate();
  const handleClose = () => {
    setOpenLogin(false);
    navigate('/register');
  };
  return (
    <Modal isOpen={openLogin} onClose={handleClose}>
      <LoginForm />
    </Modal>
  );
};
