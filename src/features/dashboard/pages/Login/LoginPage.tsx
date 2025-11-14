import { useState } from 'react';
import { Modal } from '../../../../components/Modal/Modal';
import { LoginForm } from '../../../auth/LoginForm';

export const LoginPage = () => {
  const [openLogin, setOpenLogin] = useState(false);
  return (
    <>
      <button onClick={() => setOpenLogin(true)}>Ingresar</button>
      <Modal isOpen={openLogin} onClose={() => setOpenLogin(false)}>
        <LoginForm />
      </Modal>
    </>
  );
};
