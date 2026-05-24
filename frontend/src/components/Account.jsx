import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:5000/api/auth';

const Account = () => {
    const navigate = useNavigate();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginSuccess, setLoginSuccess] = useState('');

    // Register State
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoginSuccess('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword })
            });
            const data = await response.json();

            if (!response.ok) {
                setLoginError(data.error || 'Login failed');
            } else {
                setLoginSuccess('Login successful!');
                // Save token to localStorage
                localStorage.setItem('valkey_auth_token', data.token);
                localStorage.setItem('valkey_user', JSON.stringify(data.user));
                
                // Redirect user to home page
                navigate('/');
            }
        } catch (err) {
            console.error(err);
            setLoginError('Network error occurred during login');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError('');
        setRegisterSuccess('');

        try {
            // Mapping username to firstName as per API expectations for simplicity
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: registerEmail, password: registerPassword, firstName: registerUsername })
            });
            const data = await response.json();

            if (!response.ok) {
                setRegisterError(data.error || 'Registration failed');
            } else {
                setRegisterSuccess('Registration successful! You can now log in.');
                // Clear the register form
                setRegisterUsername('');
                setRegisterEmail('');
                setRegisterPassword('');
            }
        } catch (err) {
            console.error(err);
            setRegisterError('Network error occurred during registration');
        }
    };

    return (
        <section className="account py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Login Card Start */}
                    <div className="col-xl-6 pe-xl-5">
                        <form onSubmit={handleLogin} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                            <h6 className="text-xl mb-32">Login</h6>
                            {loginError && <div className="alert alert-danger">{loginError}</div>}
                            {loginSuccess && <div className="alert alert-success">{loginSuccess}</div>}
                            
                            <div className="mb-24">
                                <label
                                    htmlFor="loginEmail"
                                    className="text-neutral-900 text-lg mb-8 fw-medium"
                                >
                                    Email address <span className="text-danger">*</span>{" "}
                                </label>
                                <input
                                    type="email"
                                    className="common-input"
                                    id="loginEmail"
                                    placeholder="Enter Email Address"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-24">
                                <label
                                    htmlFor="loginPassword"
                                    className="text-neutral-900 text-lg mb-8 fw-medium"
                                >
                                    Password <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="password"
                                        className="common-input"
                                        id="loginPassword"
                                        placeholder="Enter Password"
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-24 mt-48">
                                <div className="flex-align gap-48 flex-wrap">
                                    <button type="submit" className="btn btn-main py-18 px-40">
                                        Log in
                                    </button>
                                </div>
                            </div>
                            <div className="mt-48">
                                <Link
                                    to="#"
                                    className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                                >
                                    Forgot your password?
                                </Link>
                            </div>
                        </form>
                    </div>
                    {/* Login Card End */}

                    {/* Register Card Start */}
                    <div className="col-xl-6">
                        <form onSubmit={handleRegister} className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                            <h6 className="text-xl mb-32">Register</h6>
                            {registerError && <div className="alert alert-danger">{registerError}</div>}
                            {registerSuccess && <div className="alert alert-success">{registerSuccess}</div>}
                            
                            <div className="mb-24">
                                <label
                                    htmlFor="registerUsername"
                                    className="text-neutral-900 text-lg mb-8 fw-medium"
                                >
                                    Username <span className="text-danger">*</span>{" "}
                                </label>
                                <input
                                    type="text"
                                    className="common-input"
                                    id="registerUsername"
                                    placeholder="Write a username"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-24">
                                <label
                                    htmlFor="registerEmail"
                                    className="text-neutral-900 text-lg mb-8 fw-medium"
                                >
                                    Email address
                                    <span className="text-danger">*</span>{" "}
                                </label>
                                <input
                                    type="email"
                                    className="common-input"
                                    id="registerEmail"
                                    placeholder="Enter Email Address"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-24">
                                <label
                                    htmlFor="registerPassword"
                                    className="text-neutral-900 text-lg mb-8 fw-medium"
                                >
                                    Password
                                    <span className="text-danger">*</span>
                                </label>
                                <div className="position-relative">
                                    <input
                                        type="password"
                                        className="common-input"
                                        id="registerPassword"
                                        placeholder="Enter Password"
                                        value={registerPassword}
                                        onChange={(e) => setRegisterPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="my-48">
                                <p className="text-gray-500">
                                    Your personal data will be used to process your order, support
                                    your experience throughout this website, and for other purposes
                                    described in our
                                    <Link to="#" className="text-main-600 text-decoration-underline">
                                        {" "}
                                        privacy policy
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="mt-48">
                                <button type="submit" className="btn btn-main py-18 px-40">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Register Card End */}
                </div>
            </div>
        </section>
    )
}

export default Account