import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = 'http://localhost:8000'

const Account = () => {
    const navigate = useNavigate()

    // ── Login state ──────────────────────────────────────────────────────────
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginLoading, setLoginLoading] = useState(false)
    const [loginError, setLoginError] = useState('')

    // ── Signup state ─────────────────────────────────────────────────────────
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '' })
    const [signupLoading, setSignupLoading] = useState(false)
    const [signupError, setSignupError] = useState('')
    const [signupSuccess, setSignupSuccess] = useState('')

    // ── Password visibility ───────────────────────────────────────────────────
    const [showLoginPw, setShowLoginPw] = useState(false)
    const [showSignupPw, setShowSignupPw] = useState(false)

    // ── Helpers ───────────────────────────────────────────────────────────────
    const saveSession = ({ token, userId, name, email }) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', userId)
        localStorage.setItem('userName', name)
        localStorage.setItem('userEmail', email)
    }

    // ── Login handler ─────────────────────────────────────────────────────────
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoginError('')
        setLoginLoading(true)

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || 'Login failed. Please try again.')
            }

            saveSession(data)
            navigate('/')
        } catch (err) {
            setLoginError(err.message)
        } finally {
            setLoginLoading(false)
        }
    }

    // ── Signup handler ────────────────────────────────────────────────────────
    const handleSignup = async (e) => {
        e.preventDefault()
        setSignupError('')
        setSignupSuccess('')
        setSignupLoading(true)

        try {
            const res = await fetch(`${API_BASE}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: signupData.name,
                    email: signupData.email,
                    password: signupData.password,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || 'Registration failed. Please try again.')
            }

            saveSession(data)
            setSignupSuccess('Account created! Redirecting…')
            setTimeout(() => navigate('/'), 1200)
        } catch (err) {
            setSignupError(err.message)
        } finally {
            setSignupLoading(false)
        }
    }

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <section className="account py-80">
            <div className="container container-lg">
                <div className="row gy-4">

                    {/* ── Login Card ─────────────────────────────────────────── */}
                    <div className="col-xl-6 pe-xl-5">
                        <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                            <h6 className="text-xl mb-32">Login</h6>

                            {loginError && (
                                <div className="alert alert-danger mb-24 py-12 px-16 rounded-8 text-sm">
                                    {loginError}
                                </div>
                            )}

                            <form onSubmit={handleLogin}>
                                <div className="mb-24">
                                    <label htmlFor="login-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Email address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="common-input"
                                        id="login-email"
                                        placeholder="Enter Email Address"
                                        required
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="login-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Password
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showLoginPw ? 'text' : 'password'}
                                            className="common-input"
                                            id="login-password"
                                            placeholder="Enter Password"
                                            required
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        />
                                        <span
                                            className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showLoginPw ? 'ph-eye' : 'ph-eye-slash'}`}
                                            onClick={() => setShowLoginPw(!showLoginPw)}
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
                                            {loginLoading ? 'Logging in…' : 'Log in'}
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

                                <div className="mt-48">
                                    <Link to="#" className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* ── Login Card End ─────────────────────────────────────── */}

                    {/* ── Register Card ──────────────────────────────────────── */}
                    <div className="col-xl-6">
                        <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
                            <h6 className="text-xl mb-32">Register</h6>

                            {signupError && (
                                <div className="alert alert-danger mb-24 py-12 px-16 rounded-8 text-sm">
                                    {signupError}
                                </div>
                            )}
                            {signupSuccess && (
                                <div className="alert alert-success mb-24 py-12 px-16 rounded-8 text-sm">
                                    {signupSuccess}
                                </div>
                            )}

                            <form onSubmit={handleSignup}>
                                <div className="mb-24">
                                    <label htmlFor="signup-name" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Full name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="common-input"
                                        id="signup-name"
                                        placeholder="Enter your name"
                                        required
                                        value={signupData.name}
                                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="signup-email" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Email address <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className="common-input"
                                        id="signup-email"
                                        placeholder="Enter Email Address"
                                        required
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                    />
                                </div>

                                <div className="mb-24">
                                    <label htmlFor="signup-password" className="text-neutral-900 text-lg mb-8 fw-medium">
                                        Password <span className="text-danger">*</span>
                                    </label>
                                    <div className="position-relative">
                                        <input
                                            type={showSignupPw ? 'text' : 'password'}
                                            className="common-input"
                                            id="signup-password"
                                            placeholder="Min. 8 characters"
                                            required
                                            minLength={8}
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                        />
                                        <span
                                            className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showSignupPw ? 'ph-eye' : 'ph-eye-slash'}`}
                                            onClick={() => setShowSignupPw(!showSignupPw)}
                                        />
                                    </div>
                                </div>

                                <div className="my-48">
                                    <p className="text-gray-500">
                                        Your personal data will be used to process your order, support your experience
                                        throughout this website, and for other purposes described in our{' '}
                                        <Link to="#" className="text-main-600 text-decoration-underline">
                                            privacy policy
                                        </Link>
                                        .
                                    </p>
                                </div>

                                <div className="mt-48">
                                    <button
                                        type="submit"
                                        className="btn btn-main py-18 px-40"
                                        disabled={signupLoading}
                                    >
                                        {signupLoading ? 'Creating account…' : 'Register'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* ── Register Card End ───────────────────────────────────── */}

                </div>
            </div>
        </section>
    )
}

export default Account