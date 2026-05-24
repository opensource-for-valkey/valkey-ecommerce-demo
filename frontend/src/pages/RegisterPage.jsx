import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeaderTwo from '../components/HeaderTwo';
import Breadcrumb from '../components/Breadcrumb';
import FooterTwo from '../components/FooterTwo';
import BottomFooter from '../components/BottomFooter';
import ScrollToTop from 'react-scroll-to-top';
import ColorInit from '../helper/ColorInit';
import Preloader from '../helper/Preloader';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setLoading(true);

        try {
            await register(username, email, password);
            setSuccessMsg('Registration successful! Redirecting you to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setErrorMsg(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ColorInit color={true} />
            <ScrollToTop smooth color="#FA6400" />
            <Preloader />
            <HeaderTwo category={true} />
            <Breadcrumb title={"Register"} />

            <section className="register-section py-80 bg-neutral-50">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-5 col-md-8 col-sm-10">
                            <div className="bg-white border border-gray-100 rounded-24 shadow-sm p-40 hover-border-main-600 transition-1">
                                <div className="text-center mb-32">
                                    <h3 className="mb-8 fw-semibold text-neutral-900">Create an Account</h3>
                                    <p className="text-gray-500">Join us to experience fast checkout and personalized offers</p>
                                </div>

                                {errorMsg && (
                                    <div className="alert alert-danger border-0 rounded-12 d-flex align-items-center gap-12 py-16 px-20 mb-24" role="alert">
                                        <i className="ph-fill ph-x-circle text-2xl flex-shrink-0" />
                                        <span className="text-sm fw-medium">{errorMsg}</span>
                                    </div>
                                )}

                                {successMsg && (
                                    <div className="alert alert-success border-0 rounded-12 d-flex align-items-center gap-12 py-16 px-20 mb-24" role="alert">
                                        <i className="ph-fill ph-check-circle text-2xl flex-shrink-0" />
                                        <span className="text-sm fw-medium">{successMsg}</span>
                                    </div>
                                )}

                                <form onSubmit={handleRegister}>
                                    <div className="mb-24">
                                        <label htmlFor="username" className="text-neutral-900 text-md mb-8 fw-semibold d-block">
                                            Username <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="text"
                                                className="common-input rounded-12 ps-48"
                                                id="username"
                                                placeholder="Choose a username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                required
                                            />
                                            <span className="position-absolute top-50 translate-middle-y start-20 text-gray-400 text-xl d-flex">
                                                <i className="ph ph-user" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-24">
                                        <label htmlFor="email" className="text-neutral-900 text-md mb-8 fw-semibold d-block">
                                            Email Address <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="email"
                                                className="common-input rounded-12 ps-48"
                                                id="email"
                                                placeholder="example@email.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                            <span className="position-absolute top-50 translate-middle-y start-20 text-gray-400 text-xl d-flex">
                                                <i className="ph ph-envelope" />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-24">
                                        <label htmlFor="password" className="text-neutral-900 text-md mb-8 fw-semibold d-block">
                                            Password <span className="text-danger">*</span>
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="common-input rounded-12 ps-48 pe-48"
                                                id="password"
                                                placeholder="Choose a strong password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                            <span className="position-absolute top-50 translate-middle-y start-20 text-gray-400 text-xl d-flex">
                                                <i className="ph ph-lock" />
                                            </span>
                                            <button
                                                type="button"
                                                className="position-absolute top-50 translate-middle-y end-20 text-gray-400 text-xl d-flex border-0 bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <i className={`ph ${showPassword ? 'ph-eye-slash' : 'ph-eye'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-32">
                                        <p className="text-sm text-gray-500 mb-0">
                                            By signing up, you agree to our{' '}
                                            <Link to="#" className="text-main-600 fw-semibold text-decoration-underline">
                                                Privacy Policy
                                            </Link>{' '}
                                            and terms.
                                        </p>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-main w-100 py-16 rounded-12 fw-semibold d-flex justify-content-center align-items-center gap-8"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                Register Account
                                                <i className="ph ph-user-plus text-lg" />
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="text-center mt-32">
                                    <p className="text-gray-500 mb-0">
                                        Already have an account?{' '}
                                        <Link to="/login" className="text-main-600 fw-semibold hover-text-decoration-underline">
                                            Login here
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <FooterTwo />
            <BottomFooter />
        </>
    );
};

export default RegisterPage;
