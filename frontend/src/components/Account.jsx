import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Account = () => {
    const [activeTab, setActiveTab] = useState('login')
    const [showPassword, setShowPassword] = useState(false)

    return (
        <section
            className="account-section py-80 position-relative overflow-hidden"
            style={{
                background: '#ffffff',
                minHeight: '100vh'
            }}
        >
            {/* Soft Background Glow Effects */}
            <div
                className="position-absolute rounded-circle"
                style={{
                    width: '320px',
                    height: '320px',
                    background: 'rgba(59, 130, 246, 0.05)',
                    filter: 'blur(90px)',
                    top: '-100px',
                    left: '-80px'
                }}
            />

            <div
                className="position-absolute rounded-circle"
                style={{
                    width: '280px',
                    height: '280px',
                    background: 'rgba(168, 85, 247, 0.05)',
                    filter: 'blur(100px)',
                    bottom: '-120px',
                    right: '-50px'
                }}
            />

            <div className="container container-lg position-relative">
                <div className="row justify-content-center align-items-center">
                    <div className="col-xl-5 col-lg-7 col-md-9">
                        <div
                            className="rounded-24 overflow-hidden position-relative"
                            style={{
                                background: '#ffffff',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 25px 60px rgba(0,0,0,0.08)',
                                animation: 'fadeUp 0.6s ease'
                            }}
                        >
                            {/* Top Branding */}
                            <div className="text-center px-32 pt-40 pb-20">
                                <h2
                                    className="fw-bold mb-12"
                                    style={{
                                        color: '#111827',
                                        fontSize: '38px'
                                    }}
                                >
                                    Welcome Back
                                </h2>

                                <p
                                    className="mb-0"
                                    style={{
                                        color: '#6b7280',
                                        fontSize: '15px'
                                    }}
                                >
                                    Login or create an account to continue shopping.
                                </p>
                            </div>

                            {/* Toggle Buttons */}
                            <div className="px-32 pb-12">
                                <div
                                    className="d-flex position-relative p-1 rounded-pill"
                                    style={{
                                        background: '#f3f4f6',
                                        border: '1px solid #e5e7eb'
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('login')}
                                        className="btn flex-grow-1 rounded-pill py-14 fw-semibold position-relative z-1"
                                        style={{
                                            background:
                                                activeTab === 'login'
                                                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                                    : 'transparent',
                                            color:
                                                activeTab === 'login'
                                                    ? '#fff'
                                                    : '#111827',
                                            transition: 'all 0.35s ease',
                                            boxShadow:
                                                activeTab === 'login'
                                                    ? '0 10px 25px rgba(59,130,246,0.25)'
                                                    : 'none'
                                        }}
                                    >
                                        Login
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('signup')}
                                        className="btn flex-grow-1 rounded-pill py-14 fw-semibold position-relative z-1"
                                        style={{
                                            background:
                                                activeTab === 'signup'
                                                    ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                                                    : 'transparent',
                                            color:
                                                activeTab === 'signup'
                                                    ? '#fff'
                                                    : '#111827',
                                            transition: 'all 0.35s ease',
                                            boxShadow:
                                                activeTab === 'signup'
                                                    ? '0 10px 25px rgba(139,92,246,0.25)'
                                                    : 'none'
                                        }}
                                    >
                                        Sign Up
                                    </button>
                                </div>
                            </div>

                            {/* Form Area */}
                            <div className="px-32 py-32">
                                {activeTab === 'login' ? (
                                    <form>
                                        <div className="mb-24">
                                            <label
                                                className="mb-10 fw-medium"
                                                style={{ color: '#111827' }}
                                            >
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                className="form-control border rounded-16 py-16 px-20"
                                                placeholder="Enter your email"
                                                style={{
                                                    background: '#f9fafb',
                                                    color: '#111827',
                                                    height: '58px',
                                                    borderColor: '#e5e7eb'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-16">
                                            <label
                                                className="mb-10 fw-medium"
                                                style={{ color: '#111827' }}
                                            >
                                                Password
                                            </label>

                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control border rounded-16 py-16 px-20"
                                                    placeholder="Enter your password"
                                                    style={{
                                                        background: '#f9fafb',
                                                        color: '#111827',
                                                        height: '58px',
                                                        borderColor: '#e5e7eb'
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                                                    style={{ color: '#6b7280' }}
                                                >
                                                    <i
                                                        className={`ph ${showPassword
                                                                ? 'ph-eye'
                                                                : 'ph-eye-slash'
                                                            }`}
                                                        style={{ fontSize: '20px' }}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center mb-32 mt-24 flex-wrap gap-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="rememberMe"
                                                />

                                                <label
                                                    className="form-check-label"
                                                    htmlFor="rememberMe"
                                                    style={{ color: '#4b5563' }}
                                                >
                                                    Remember me
                                                </label>
                                            </div>

                                            <Link
                                                to="#"
                                                style={{
                                                    color: '#2563eb',
                                                    textDecoration: 'none',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Forgot Password?
                                            </Link>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100 rounded-16 py-16 fw-semibold"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                                color: '#fff',
                                                border: 'none',
                                                fontSize: '16px',
                                                transition: '0.3s ease',
                                                boxShadow:
                                                    '0 12px 30px rgba(59,130,246,0.25)'
                                            }}
                                        >
                                            Login to Account
                                        </button>
                                    </form>
                                ) : (
                                    <form>
                                        <div className="mb-24">
                                            <label
                                                className="mb-10 fw-medium"
                                                style={{ color: '#111827' }}
                                            >
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                className="form-control border rounded-16 py-16 px-20"
                                                placeholder="Enter your full name"
                                                style={{
                                                    background: '#f9fafb',
                                                    color: '#111827',
                                                    height: '58px',
                                                    borderColor: '#e5e7eb'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-24">
                                            <label
                                                className="mb-10 fw-medium"
                                                style={{ color: '#111827' }}
                                            >
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                className="form-control border rounded-16 py-16 px-20"
                                                placeholder="Enter your email"
                                                style={{
                                                    background: '#f9fafb',
                                                    color: '#111827',
                                                    height: '58px',
                                                    borderColor: '#e5e7eb'
                                                }}
                                            />
                                        </div>

                                        <div className="mb-24">
                                            <label
                                                className="mb-10 fw-medium"
                                                style={{ color: '#111827' }}
                                            >
                                                Password
                                            </label>

                                            <div className="position-relative">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="form-control border rounded-16 py-16 px-20"
                                                    placeholder="Create a password"
                                                    style={{
                                                        background: '#f9fafb',
                                                        color: '#111827',
                                                        height: '58px',
                                                        borderColor: '#e5e7eb'
                                                    }}
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                                                    style={{ color: '#6b7280' }}
                                                >
                                                    <i
                                                        className={`ph ${showPassword
                                                                ? 'ph-eye'
                                                                : 'ph-eye-slash'
                                                            }`}
                                                        style={{ fontSize: '20px' }}
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-32">
                                            <p
                                                className="mb-0"
                                                style={{
                                                    color: '#6b7280',
                                                    fontSize: '14px',
                                                    lineHeight: '26px'
                                                }}
                                            >
                                                By creating an account you agree to our{' '}
                                                <Link
                                                    to="#"
                                                    style={{
                                                        color: '#2563eb',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    Terms & Conditions
                                                </Link>{' '}
                                                and Privacy Policy.
                                            </p>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100 rounded-16 py-16 fw-semibold"
                                            style={{
                                                background:
                                                    'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                                                color: '#fff',
                                                border: 'none',
                                                fontSize: '16px',
                                                transition: '0.3s ease',
                                                boxShadow:
                                                    '0 12px 30px rgba(139,92,246,0.25)'
                                            }}
                                        >
                                            Create Account
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Animation Styles */}
            <style>
                {`
                    @keyframes fadeUp {
                        from {
                            opacity: 0;
                            transform: translateY(40px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .account-section input::placeholder {
                        color: #9ca3af;
                    }

                    .account-section input:focus {
                        box-shadow: 0 0 0 3px rgba(59,130,246,0.15) !important;
                        background: #ffffff !important;
                        color: #111827 !important;
                        border-color: #3b82f6 !important;
                    }

                    .account-section .btn:hover {
                        transform: translateY(-2px);
                    }
                `}
            </style>
        </section>
    )
}

export default Account