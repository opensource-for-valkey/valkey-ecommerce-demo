import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const Account = () => {
    const navigate = useNavigate();
    const user = useAuth((s) => s.user);
    const ready = useAuth((s) => s.ready);
    const login = useAuth((s) => s.login);
    const register = useAuth((s) => s.register);
    const logout = useAuth((s) => s.logout);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState(null);
    const [loggingIn, setLoggingIn] = useState(false);

    const [regFirstName, setRegFirstName] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regError, setRegError] = useState(null);
    const [registering, setRegistering] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError(null);
        setLoggingIn(true);
        try {
            await login({ email: loginEmail.trim(), password: loginPassword });
            navigate("/");
        } catch (err) {
            setLoginError(err.message || "Login failed");
        } finally {
            setLoggingIn(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError(null);
        setRegistering(true);
        try {
            await register({
                email: regEmail.trim(),
                password: regPassword,
                firstName: regFirstName.trim() || undefined,
            });
            navigate("/");
        } catch (err) {
            setRegError(err.message || "Registration failed");
        } finally {
            setRegistering(false);
        }
    };

    if (!ready) {
        return (
            <section className="account py-80">
                <div className="container container-lg text-center text-gray-500">Loading…</div>
            </section>
        );
    }

    if (user) {
        return (
            <section className="account py-80">
                <div className="container container-lg">
                    <div className="border border-gray-100 rounded-16 px-24 py-40 mx-auto" style={{ maxWidth: 560 }}>
                        <h6 className="text-xl mb-16">Welcome back{user.firstName ? `, ${user.firstName}` : ""}</h6>
                        <p className="text-gray-700 mb-32">Signed in as <strong>{user.email}</strong></p>
                        <div className="flex-align gap-16 flex-wrap">
                            <Link to="/shop" className="btn btn-main py-14 px-32">Continue shopping</Link>
                            <Link to="/cart" className="btn btn-outline-main py-14 px-32">View cart</Link>
                            <button
                                type="button"
                                className="btn btn-outline-danger py-14 px-32"
                                onClick={() => logout()}
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Login Card */}
                    <div className="col-xl-6 pe-xl-5">
                        <form onSubmit={handleLogin} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                            <h6 className="text-xl mb-32">Login</h6>
                            <div className="mb-24">
                                <label htmlFor="login-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                    Email address <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="common-input"
                                    id="login-email"
                                    placeholder="you@example.com"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="mb-24">
                                <label htmlFor="login-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                    Password <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="common-input"
                                    id="login-password"
                                    placeholder="Enter password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    autoComplete="current-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                            {loginError && (
                                <p className="text-danger-600 mb-16">{loginError}</p>
                            )}
                            <div className="mb-24 mt-32">
                                <button type="submit" disabled={loggingIn} className="btn btn-main py-18 px-40">
                                    {loggingIn ? "Signing in…" : "Log in"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Register Card */}
                    <div className="col-xl-6">
                        <form onSubmit={handleRegister} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                            <h6 className="text-xl mb-32">Register</h6>
                            <div className="mb-24">
                                <label htmlFor="reg-firstname" className="text-neutral-900 text-lg mb-8 fw-medium">
                                    First name
                                </label>
                                <input
                                    type="text"
                                    className="common-input"
                                    id="reg-firstname"
                                    placeholder="Your first name"
                                    value={regFirstName}
                                    onChange={(e) => setRegFirstName(e.target.value)}
                                    autoComplete="given-name"
                                />
                            </div>
                            <div className="mb-24">
                                <label htmlFor="reg-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                    Email address <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="email"
                                    className="common-input"
                                    id="reg-email"
                                    placeholder="you@example.com"
                                    value={regEmail}
                                    onChange={(e) => setRegEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="mb-24">
                                <label htmlFor="reg-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                    Password <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="password"
                                    className="common-input"
                                    id="reg-password"
                                    placeholder="At least 8 characters"
                                    value={regPassword}
                                    onChange={(e) => setRegPassword(e.target.value)}
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                            {regError && (
                                <p className="text-danger-600 mb-16">{regError}</p>
                            )}
                            <div className="mt-32">
                                <button type="submit" disabled={registering} className="btn btn-main py-18 px-40">
                                    {registering ? "Creating account…" : "Register"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Account;
