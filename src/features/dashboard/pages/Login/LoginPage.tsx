import { Modal } from '../../../../components/Modal/Modal';
import { LoginForm } from '../../../auth/LoginForm';

export const LoginPage = () => {
  return (
    <>
      {/* <button onClick={() => setOpenLogin(true)}>Ingresar</button> */}
      <Modal isOpen={true} onClose={() => {}}>
        <LoginForm />
      </Modal>
    </>
  );
};
