import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Account = () => {
    const { currentUser, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-120">
                <div className="spinner-border text-main-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        return null; // Will redirect via useEffect
    }

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error('Failed to log out:', err);
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const sessionToken = localStorage.getItem('session_token') || 'N/A';

    return (
        <section className="account-dashboard py-80 bg-neutral-50">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Sidebar Profile Card */}
                    <div className="col-xl-4 col-lg-5">
                        <div className="bg-white border border-gray-100 rounded-24 shadow-sm p-32 text-center h-100 hover-border-main-600 transition-1">
                            <div className="position-relative d-inline-block mb-24">
                                <div className="w-120 h-120 rounded-circle border border-4 border-main-100 overflow-hidden mx-auto bg-main-50 flex-center">
                                    <i className="ph-fill ph-user-circle text-neutral-800" style={{ fontSize: '120px' }} />
                                </div>
                                <span className="position-absolute bottom-0 end-0 bg-success-600 border border-4 border-white w-24 h-24 rounded-circle" title="Online" />
                            </div>

                            <h5 className="mb-4 text-neutral-900 fw-bold">{currentUser.username}</h5>
                            <span className="badge bg-main-100 text-main-700 text-xs px-12 py-6 rounded-pill fw-semibold text-uppercase mb-24 d-inline-block">
                                {currentUser.role || 'Customer'}
                            </span>

                            <div className="border-top border-gray-100 pt-24 mt-8 text-start">
                                <div className="d-flex align-items-center gap-12 mb-16">
                                    <span className="w-36 h-36 bg-neutral-50 text-gray-500 rounded-circle flex-center text-lg">
                                        <i className="ph ph-envelope" />
                                    </span>
                                    <div>
                                        <span className="text-xs text-gray-400 d-block">Email Address</span>
                                        <span className="text-sm fw-semibold text-neutral-800">{currentUser.email}</span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-12 mb-16">
                                    <span className="w-36 h-36 bg-neutral-50 text-gray-500 rounded-circle flex-center text-lg">
                                        <i className="ph ph-calendar" />
                                    </span>
                                    <div>
                                        <span className="text-xs text-gray-400 d-block">Account Created</span>
                                        <span className="text-sm fw-semibold text-neutral-800">{formatDate(currentUser.createdAt)}</span>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center gap-12 mb-0">
                                    <span className="w-36 h-36 bg-neutral-50 text-gray-500 rounded-circle flex-center text-lg">
                                        <i className="ph ph-clock-clockwise" />
                                    </span>
                                    <div>
                                        <span className="text-xs text-gray-400 d-block">Last Activity</span>
                                        <span className="text-sm fw-semibold text-neutral-800">{formatDate(currentUser.lastLoginAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="btn btn-outline-danger w-100 mt-40 rounded-12 py-14 flex-center gap-8 fw-semibold"
                            >
                                <i className="ph ph-sign-out text-lg" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Content Dashboard */}
                    <div className="col-xl-8 col-lg-7">
                        <div className="bg-white border border-gray-100 rounded-24 shadow-sm p-40 h-100 hover-border-main-600 transition-1">
                            <h4 className="mb-8 fw-semibold text-neutral-900">User Profile Overview</h4>
                            <p className="text-gray-500 mb-32">View and manage your account preferences, profile settings, and personal details.</p>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <div className="border border-gray-100 rounded-16 p-24 bg-neutral-50 h-100">
                                        <h6 className="text-md fw-bold text-neutral-900 mb-16 flex-align gap-8">
                                            <i className="ph-fill ph-gear text-main-600" />
                                            Preferences
                                        </h6>
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between align-items-center mb-12 border-bottom border-gray-200 pb-12">
                                                <span className="text-sm text-gray-500">Currency</span>
                                                <span className="text-sm fw-semibold text-neutral-900">{currentUser.preferences?.currency || 'INR'}</span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center mb-12 border-bottom border-gray-200 pb-12">
                                                <span className="text-sm text-gray-500">Language</span>
                                                <span className="text-sm fw-semibold text-neutral-900">{currentUser.preferences?.language === 'en' ? 'English (EN)' : currentUser.preferences?.language || 'English (EN)'}</span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center">
                                                <span className="text-sm text-gray-500">Notifications</span>
                                                <span className="text-sm fw-semibold text-neutral-900">{currentUser.preferences?.notifications ? 'Enabled' : 'Disabled'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="border border-gray-100 rounded-16 p-24 bg-neutral-50 h-100">
                                        <h6 className="text-md fw-bold text-neutral-900 mb-16 flex-align gap-8">
                                            <i className="ph-fill ph-crown text-warning-600" />
                                            Membership & Status
                                        </h6>
                                        <ul className="list-unstyled mb-0">
                                            <li className="d-flex justify-content-between align-items-center mb-12 border-bottom border-gray-200 pb-12">
                                                <span className="text-sm text-gray-500">Tier</span>
                                                <span className="badge bg-warning-100 text-warning-800 border border-warning-200 fw-bold px-12 py-6 rounded-8 flex-align gap-4">
                                                    <i className="ph-fill ph-sparkle text-xs" /> Gold Member
                                                </span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center mb-12 border-bottom border-gray-200 pb-12">
                                                <span className="text-sm text-gray-500">Verification</span>
                                                <span className="text-sm fw-semibold text-success-600 flex-align gap-4">
                                                    <i className="ph-fill ph-check-circle text-xs" /> Verified Profile
                                                </span>
                                            </li>
                                            <li className="d-flex justify-content-between align-items-center">
                                                <span className="text-sm text-gray-500">Member ID</span>
                                                <span className="text-sm fw-semibold text-neutral-900">VM-{currentUser.id?.slice(0, 8).toUpperCase() || 'USER'}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="col-12 mt-32">
                                    <div className="border border-gray-100 rounded-16 p-24">
                                        <h6 className="text-md fw-bold text-neutral-900 mb-20 flex-align gap-8">
                                            <i className="ph-fill ph-identification-card text-main-600" />
                                            Personal Details
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <span className="text-xs text-gray-400 d-block">First Name</span>
                                                <span className="text-sm fw-semibold text-neutral-800">{currentUser.firstName || 'Not Set'}</span>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="text-xs text-gray-400 d-block">Last Name</span>
                                                <span className="text-sm fw-semibold text-neutral-800">{currentUser.lastName || 'Not Set'}</span>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="text-xs text-gray-400 d-block">Contact Phone</span>
                                                <span className="text-sm fw-semibold text-neutral-800">{currentUser.phone || 'Not Registered'}</span>
                                            </div>
                                            <div className="col-sm-6">
                                                <span className="text-xs text-gray-400 d-block">User Role Index</span>
                                                <span className="text-sm fw-semibold text-neutral-800 text-capitalize">{currentUser.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Account;