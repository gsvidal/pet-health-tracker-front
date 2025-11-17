import './Dashboard.scss';
import { useState } from 'react';
import { useAuthStore } from '../../../../store/auth.store';

export const Dashboard = () => {
  const { user, isAuthenticated, login, register, logout, loading, error } =
    useAuthStore();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    } catch (err) {
      // Error ya manejado en el store
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password });
    } catch (err) {
      // Error ya manejado en el store
    }
  };

  const handleTestSuccess = () => {
    setEmail('test@example.com');
    setPassword('Test1234');
  };

  const handleTestError = () => {
    setEmail('wrong@example.com');
    setPassword('wrong');
  };

  if (!isAuthenticated) {
    return (
      <div>
        <h2>{isRegister ? 'Register Test' : 'Login Test'}</h2>
        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        <form onSubmit={isRegister ? handleRegister : handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => setIsRegister(!isRegister)} disabled={loading}>
            Switch to {isRegister ? 'Login' : 'Register'}
          </button>
          {!isRegister && (
            <>
              <button onClick={handleTestSuccess} disabled={loading}>
                Test Success
              </button>
              <button onClick={handleTestError} disabled={loading}>
                Test Error
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <section className="dashboard">
      <div className="container container--dashboard">
        <h1 className="example__title">This is Dashboard page</h1>
        <p>Welcome {user?.username}</p>
        <p>Role: {user?.role}</p>
        <p>Member since: {user?.createdAt}</p>
        <button onClick={logout} disabled={loading}>
          Logout
        </button>
      </div>
    </section>
  );
};
