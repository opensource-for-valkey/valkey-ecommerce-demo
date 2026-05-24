import React, { useEffect, useState } from "react";
import ValkeyChallengeNav from "./ValkeyChallengeNav";
import { useCart } from "../context/CartContext";
import {
  getCurrentAccount,
  getSessionToken,
  loginAccount,
  logoutAccount,
  registerAccount,
} from "../services/valkeyApi";

const Account = () => {
  const { refreshCart } = useCart();
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "team-dod@example.com", password: "ValkeyDemo123" });
  const [registerForm, setRegisterForm] = useState({
    firstName: "Team",
    lastName: "DoD",
    email: `team-dod-${Date.now()}@example.com`,
    password: "ValkeyDemo123",
    phone: "+91-4012345678",
  });
  const [message, setMessage] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!getSessionToken()) {
      return;
    }

    getCurrentAccount()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  function updateLogin(field, value) {
    setLoginForm((current) => ({ ...current, [field]: value }));
  }

  function updateRegister(field, value) {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  }

  async function submitLogin(event) {
    event.preventDefault();
    setWorking(true);
    setMessage("");
    try {
      const data = await loginAccount(loginForm);
      setUser(data.user);
      await refreshCart();
      setMessage("Logged in. Guest cart items were merged into this Valkey-backed account cart.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setWorking(false);
    }
  }

  async function submitRegister(event) {
    event.preventDefault();
    setWorking(true);
    setMessage("");
    try {
      const data = await registerAccount(registerForm);
      setUser(data.user);
      await refreshCart();
      setMessage("Account created with a Valkey JSON user document and expiring session token.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setWorking(false);
    }
  }

  async function submitLogout() {
    setWorking(true);
    setMessage("");
    try {
      await logoutAccount();
      setUser(null);
      await refreshCart();
      setMessage("Logged out. The session key was deleted from Valkey.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <>
      <ValkeyChallengeNav />
      <section className="account py-80">
        <div className="container container-lg">
          {message && <div className="alert alert-info rounded-8">{message}</div>}
          {user && (
            <div className="border border-gray-100 rounded-8 px-24 py-24 mb-32 flex-between gap-16 flex-wrap">
              <div>
                <span className="text-sm text-main-600 fw-semibold">Challenge 1</span>
                <h6 className="mb-4">{user.firstName} {user.lastName}</h6>
                <span className="text-gray-600">{user.email}</span>
              </div>
              <button className="btn bg-gray-50 text-heading py-12 px-18 rounded-8 hover-bg-main-600 hover-text-white flex-align gap-8" type="button" onClick={() => void submitLogout()} disabled={working}>
                <i className="ph ph-sign-out" />
                Log out
              </button>
            </div>
          )}

          <div className="row gy-4">
            <div className="col-xl-6 pe-xl-5">
              <form onSubmit={submitLogin} className="border border-gray-100 hover-border-main-600 transition-1 rounded-8 px-24 py-40 h-100">
                <h6 className="text-xl mb-32">Login</h6>
                <div className="mb-24">
                  <label htmlFor="login-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Email address <span className="text-danger">*</span>
                  </label>
                  <input type="email" className="common-input" id="login-email" value={loginForm.email} onChange={(event) => updateLogin("email", event.target.value)} />
                </div>
                <div className="mb-24">
                  <label htmlFor="login-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input type="password" className="common-input" id="login-password" value={loginForm.password} onChange={(event) => updateLogin("password", event.target.value)} />
                </div>
                <button type="submit" className="btn btn-main py-16 px-32 flex-align gap-8" disabled={working}>
                  <i className="ph ph-sign-in" />
                  Log in
                </button>
              </form>
            </div>

            <div className="col-xl-6">
              <form onSubmit={submitRegister} className="border border-gray-100 hover-border-main-600 transition-1 rounded-8 px-24 py-40">
                <h6 className="text-xl mb-32">Register</h6>
                <div className="row gy-3">
                  <div className="col-sm-6">
                    <label htmlFor="register-first-name" className="text-neutral-900 text-lg mb-8 fw-medium">
                      First name <span className="text-danger">*</span>
                    </label>
                    <input className="common-input" id="register-first-name" value={registerForm.firstName} onChange={(event) => updateRegister("firstName", event.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="register-last-name" className="text-neutral-900 text-lg mb-8 fw-medium">
                      Last name <span className="text-danger">*</span>
                    </label>
                    <input className="common-input" id="register-last-name" value={registerForm.lastName} onChange={(event) => updateRegister("lastName", event.target.value)} />
                  </div>
                  <div className="col-12">
                    <label htmlFor="register-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                      Email address <span className="text-danger">*</span>
                    </label>
                    <input type="email" className="common-input" id="register-email" value={registerForm.email} onChange={(event) => updateRegister("email", event.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="register-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                      Password <span className="text-danger">*</span>
                    </label>
                    <input type="password" className="common-input" id="register-password" value={registerForm.password} onChange={(event) => updateRegister("password", event.target.value)} />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="register-phone" className="text-neutral-900 text-lg mb-8 fw-medium">
                      Phone
                    </label>
                    <input className="common-input" id="register-phone" value={registerForm.phone} onChange={(event) => updateRegister("phone", event.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn-main py-16 px-32 mt-32 flex-align gap-8" disabled={working}>
                  <i className="ph ph-user-plus" />
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;
