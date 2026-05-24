import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ─── Logged-in: Profile Dashboard ────────────────────────────────────────────

const ProfileDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase();

  const formatDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  return (
    <section className="account py-80">
      <div className="container container-lg">
        <div className="row gy-4">

          {/* ── Sidebar ── */}
          <div className="col-xl-3 col-lg-4">
            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 text-center h-100">
              {/* Avatar */}
              <div
                className="mx-auto mb-16 rounded-circle flex-center fw-bold text-white text-2xl"
                style={{
                  width: 88, height: 88,
                  background: 'linear-gradient(135deg, #FA6400 0%, #ff8c42 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 700,
                }}
              >
                {initials}
              </div>

              <h6 className="text-xl mb-4 fw-semibold">
                {user.firstName} {user.lastName}
              </h6>
              <p className="text-gray-500 text-sm mb-12">{user.email}</p>

              <span
                className="text-xs px-12 py-4 rounded-pill fw-semibold"
                style={{ background: '#FFF3EB', color: '#FA6400', textTransform: 'capitalize' }}
              >
                {user.role}
              </span>

              <hr className="my-24 border-gray-100" />

              {/* Nav tabs */}
              <ul className="list-unstyled text-start">
                {[
                  { id: 'profile', icon: 'ph-user', label: 'Profile' },
                  { id: 'orders', icon: 'ph-package', label: 'My Orders' },
                  { id: 'addresses', icon: 'ph-map-pin', label: 'Addresses' },
                  { id: 'security', icon: 'ph-shield-check', label: 'Security' },
                ].map(({ id, icon, label }) => (
                  <li key={id} className="mb-4">
                    <button
                      onClick={() => setActiveTab(id)}
                      className="w-100 text-start px-16 py-10 rounded-8 border-0 d-flex align-items-center gap-8 transition-1"
                      style={{
                        background: activeTab === id ? '#FFF3EB' : 'transparent',
                        color: activeTab === id ? '#FA6400' : '#555',
                        fontWeight: activeTab === id ? 600 : 400,
                        cursor: 'pointer',
                      }}
                    >
                      <i className={`ph ${icon} text-lg`} />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>

              <hr className="my-24 border-gray-100" />

              <button
                onClick={handleLogout}
                className="btn w-100 py-12 rounded-8 d-flex align-items-center justify-content-center gap-8"
                style={{ border: '1px solid #dc3545', color: '#dc3545', background: 'transparent' }}
              >
                <i className="ph ph-sign-out" style={{ color: '#dc3545' }} />
                <span style={{ color: '#dc3545' }}>Sign Out</span>
              </button>
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="col-xl-9 col-lg-8">
            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">

              {activeTab === 'profile' && (
                <>
                  <h6 className="text-xl mb-32 fw-semibold">Account Information</h6>
                  <div className="row gy-24">
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">First Name</label>
                      <input className="common-input" readOnly value={user.firstName} />
                    </div>
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Last Name</label>
                      <input className="common-input" readOnly value={user.lastName} />
                    </div>
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Email Address</label>
                      <input className="common-input" readOnly value={user.email} />
                    </div>
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Phone</label>
                      <input className="common-input" readOnly value={user.phone || '—'} />
                    </div>
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Member Since</label>
                      <input className="common-input" readOnly value={formatDate(user.createdAt)} />
                    </div>
                    <div className="col-sm-6">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Last Login</label>
                      <input className="common-input" readOnly value={formatDate(user.lastLoginAt)} />
                    </div>
                    <div className="col-12">
                      <label className="text-neutral-900 text-sm mb-8 fw-medium d-block">Currency</label>
                      <input className="common-input" readOnly value={user.preferences?.currency || 'INR'} style={{ maxWidth: 200 }} />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'orders' && (
                <div className="text-center py-48">
                  <i className="ph ph-package text-gray-300" style={{ fontSize: 64 }} />
                  <h6 className="text-xl mt-24 mb-8 text-gray-500">No Orders Yet</h6>
                  <p className="text-gray-400 mb-24">Your order history will appear here once you make a purchase.</p>
                  <Link to="/shop" className="btn btn-main py-12 px-32">Browse Products</Link>
                </div>
              )}

              {activeTab === 'addresses' && (
                <div className="text-center py-48">
                  <i className="ph ph-map-pin text-gray-300" style={{ fontSize: 64 }} />
                  <h6 className="text-xl mt-24 mb-8 text-gray-500">No Saved Addresses</h6>
                  <p className="text-gray-400">Saved addresses will appear here after checkout.</p>
                </div>
              )}

              {activeTab === 'security' && (
                <>
                  <h6 className="text-xl mb-32 fw-semibold">Security Settings</h6>
                  <div className="border border-gray-100 rounded-12 p-24 mb-24 d-flex align-items-center gap-16">
                    <div
                      className="rounded-circle flex-center flex-shrink-0"
                      style={{ width: 48, height: 48, background: '#e8f5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="ph ph-shield-check text-xl" style={{ color: '#2e7d32' }} />
                    </div>
                    <div>
                      <p className="fw-semibold mb-4">Password</p>
                      <p className="text-gray-500 text-sm">Last changed: unknown</p>
                    </div>
                    <button className="btn btn-outline-main py-8 px-20 ms-auto" disabled>Change Password</button>
                  </div>
                  <div className="border border-gray-100 rounded-12 p-24 d-flex align-items-center gap-16">
                    <div
                      className="rounded-circle flex-center flex-shrink-0"
                      style={{ width: 48, height: 48, background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <i className="ph ph-lock text-xl" style={{ color: '#1565c0' }} />
                    </div>
                    <div>
                      <p className="fw-semibold mb-4">Active Sessions</p>
                      <p className="text-gray-500 text-sm">You are currently logged in on this device.</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="btn py-8 px-20 ms-auto"
                      style={{ border: '1px solid #dc3545', color: '#dc3545', background: 'transparent' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ─── Not logged-in: Login + Register forms ────────────────────────────────────

const AuthForms = () => {
  const { login, register } = useAuth();

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginPw, setShowLoginPw] = useState(false);

  // Register state
  const [regData, setRegData] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '',
  });
  const [regError, setRegError] = useState('');
  const [regLoading, setRegLoading] = useState(false);
  const [showRegPw, setShowRegPw] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(loginData.email, loginData.password);
      // AuthContext sets user → component re-renders to ProfileDashboard
    } catch (err) {
      setLoginError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setRegLoading(true);
    try {
      await register(regData);
    } catch (err) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <section className="account py-80">
      <div className="container container-lg">
        <div className="row gy-4">

          {/* ── Login Card ── */}
          <div className="col-xl-6 pe-xl-5">
            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
              <h6 className="text-xl mb-32">Login</h6>

              {loginError && (
                <div className="alert alert-danger py-10 px-16 rounded-8 mb-24 text-sm">
                  <i className="ph ph-warning me-8" />{loginError}
                </div>
              )}

              <form onSubmit={handleLogin}>
                <div className="mb-24">
                  <label htmlFor="login-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    className="common-input"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-24">
                  <label htmlFor="login-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      id="login-password"
                      className="common-input"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      autoComplete="current-password"
                    />
                    <span
                      onClick={() => setShowLoginPw(!showLoginPw)}
                      className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showLoginPw ? 'ph-eye' : 'ph-eye-slash'}`}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div className="mb-24 mt-48">
                  <div className="flex-align gap-48 flex-wrap">
                    <button
                      type="submit"
                      className="btn btn-main py-18 px-40"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <span className="d-flex align-items-center gap-8">
                          <span className="spinner-border spinner-border-sm" /> Logging in...
                        </span>
                      ) : 'Log In'}
                    </button>
                    <div className="form-check common-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="remember"
                      />
                      <label className="form-check-label flex-grow-1" htmlFor="remember">
                        Remember me
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-24">
                  <Link to="#" className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline">
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* ── Register Card ── */}
          <div className="col-xl-6">
            <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
              <h6 className="text-xl mb-32">Register</h6>

              {regError && (
                <div className="alert alert-danger py-10 px-16 rounded-8 mb-24 text-sm">
                  <i className="ph ph-warning me-8" />{regError}
                </div>
              )}

              <form onSubmit={handleRegister}>
                <div className="row gy-0">
                  <div className="col-sm-6 mb-24">
                    <label htmlFor="reg-firstName" className="text-neutral-900 text-lg mb-8 fw-medium">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="reg-firstName"
                      className="common-input"
                      placeholder="First name"
                      value={regData.firstName}
                      onChange={(e) => setRegData({ ...regData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-sm-6 mb-24 ps-sm-12">
                    <label htmlFor="reg-lastName" className="text-neutral-900 text-lg mb-8 fw-medium">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="reg-lastName"
                      className="common-input"
                      placeholder="Last name"
                      value={regData.lastName}
                      onChange={(e) => setRegData({ ...regData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="mb-24">
                  <label htmlFor="reg-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    id="reg-email"
                    className="common-input"
                    placeholder="Enter your email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="mb-24">
                  <label htmlFor="reg-phone" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Phone <span className="text-gray-400 text-sm">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    id="reg-phone"
                    className="common-input"
                    placeholder="+91-9876543210"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                  />
                </div>

                <div className="mb-24">
                  <label htmlFor="reg-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Password <span className="text-danger">*</span>
                  </label>
                  <div className="position-relative">
                    <input
                      type={showRegPw ? 'text' : 'password'}
                      id="reg-password"
                      className="common-input"
                      placeholder="At least 6 characters"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      required
                      minLength={6}
                      autoComplete="new-password"
                    />
                    <span
                      onClick={() => setShowRegPw(!showRegPw)}
                      className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y ph ${showRegPw ? 'ph-eye' : 'ph-eye-slash'}`}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                </div>

                <div className="my-24">
                  <p className="text-gray-500 text-sm">
                    Your personal data will be used to process your order and support your experience.
                    See our{' '}
                    <Link to="#" className="text-main-600 text-decoration-underline">
                      privacy policy
                    </Link>.
                  </p>
                </div>

                <div className="mt-24">
                  <button
                    type="submit"
                    className="btn btn-main py-18 px-40"
                    disabled={regLoading}
                  >
                    {regLoading ? (
                      <span className="d-flex align-items-center gap-8">
                        <span className="spinner-border spinner-border-sm" /> Creating account...
                      </span>
                    ) : 'Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ─── Root component ───────────────────────────────────────────────────────────

const Account = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="account py-80">
        <div className="container container-lg text-center py-48">
          <div className="spinner-border text-main-600" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </section>
    );
  }

  return user ? <ProfileDashboard /> : <AuthForms />;
};

export default Account;
