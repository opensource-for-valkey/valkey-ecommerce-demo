import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ordersAPI } from '../services/ordersAPI'

const AccountDashboard = () => {
    const { user, logout, updateProfile, changePassword } = useAuth();
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'dashboard';
    const [activeTab, setActiveTab] = useState(initialTab);

    const handleLogout = async () => { await logout(); };

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: 'ph ph-squares-four' },
        { id: 'orders', label: 'Orders', icon: 'ph ph-package' },
        { id: 'profile', label: 'Account Details', icon: 'ph ph-user-circle' },
        { id: 'addresses', label: 'Addresses', icon: 'ph ph-map-pin' },
        { id: 'password', label: 'Change Password', icon: 'ph ph-lock' },
    ];

    return (
        <section className="py-80">
            <div className="container container-lg">
                <div className="row gy-4">
                    {/* Sidebar */}
                    <div className="col-xl-3 col-lg-4">
                        <div className="rounded-16 overflow-hidden shadow-sm" style={{ border: '1px solid #eee' }}>
                            <div className="bg-main-two-600 px-24 py-40 text-center">
                                <div className="mx-auto mb-12 rounded-circle bg-white d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                    <span className="text-main-600 fw-bold" style={{ fontSize: '26px' }}>{user.username.charAt(0).toUpperCase()}</span>
                                </div>
                                <h6 className="text-white text-lg fw-bold mb-4">{user.username}</h6>
                                <p className="text-white text-xs mb-0" style={{ opacity: 0.7 }}>{user.email}</p>
                            </div>
                            <div className="bg-white py-12">
                                {tabs.map((tab) => (
                                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                        className={`d-flex align-items-center gap-12 px-24 py-12 w-100 border-0 text-start ${activeTab === tab.id ? 'bg-main-50 text-main-600 fw-semibold' : 'bg-white text-gray-600'}`}
                                        style={{ cursor: 'pointer', borderLeft: activeTab === tab.id ? '3px solid var(--main-600)' : '3px solid transparent', transition: 'all 0.15s' }}>
                                        <i className={`${tab.icon} text-xl`} />
                                        <span className="text-sm">{tab.label}</span>
                                    </button>
                                ))}
                                <hr className="my-8 mx-24" style={{ borderColor: '#f0f0f0' }} />
                                <button type="button" onClick={handleLogout}
                                    className="d-flex align-items-center gap-12 px-24 py-12 w-100 border-0 text-start bg-white text-danger"
                                    style={{ cursor: 'pointer', borderLeft: '3px solid transparent' }}>
                                    <i className="ph ph-sign-out text-xl" />
                                    <span className="text-sm">Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="col-xl-9 col-lg-8">
                        {activeTab === 'dashboard' && <DashboardTab user={user} setActiveTab={setActiveTab} />}
                        {activeTab === 'orders' && <OrdersTab />}
                        {activeTab === 'profile' && <ProfileTab user={user} updateProfile={updateProfile} />}
                        {activeTab === 'addresses' && <AddressesTab user={user} updateProfile={updateProfile} />}
                        {activeTab === 'password' && <PasswordTab changePassword={changePassword} />}
                    </div>
                </div>
            </div>
        </section>
    );
};

/* ==================== DASHBOARD TAB ==================== */
const DashboardTab = ({ user, setActiveTab }) => {
    const [stats, setStats] = useState({ total: 0, pending: 0 });
    useEffect(() => {
        ordersAPI.getOrders()
            .then(data => { const o = data.orders || []; setStats({ total: o.length, pending: o.filter(x => x.status === 'Processing').length }); })
            .catch(() => {});
    }, []);

    return (
        <div>
            {/* Welcome */}
            <div className="bg-main-50 rounded-16 px-32 py-32 mb-24 border border-main-100">
                <h5 className="text-neutral-900 mb-8" style={{ fontSize: '22px' }}>Welcome back, <span className="text-main-600">{user.username}</span> 👋</h5>
                <p className="text-gray-500 text-md mb-0">Here's an overview of your account activity.</p>
            </div>

            {/* Stats */}
            <div className="row g-3 mb-24">
                <div className="col-md-4">
                    <div className="bg-white rounded-16 p-24 text-center shadow-sm border border-gray-100 hover-border-main-600 transition-2" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('orders')}>
                        <i className="ph-fill ph-package text-main-600 mb-8" style={{ fontSize: '32px' }} />
                        <h3 className="text-neutral-900 fw-bold mb-4">{stats.total}</h3>
                        <p className="text-gray-500 text-sm mb-0">Total Orders</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bg-white rounded-16 p-24 text-center shadow-sm border border-gray-100 hover-border-main-600 transition-2">
                        <i className="ph-fill ph-clock text-warning-600 mb-8" style={{ fontSize: '32px' }} />
                        <h3 className="text-neutral-900 fw-bold mb-4">{stats.pending}</h3>
                        <p className="text-gray-500 text-sm mb-0">Processing</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="bg-white rounded-16 p-24 text-center shadow-sm border border-gray-100 hover-border-main-600 transition-2">
                        <i className="ph-fill ph-heart text-danger mb-8" style={{ fontSize: '32px' }} />
                        <h3 className="text-neutral-900 fw-bold mb-4">0</h3>
                        <p className="text-gray-500 text-sm mb-0">Wishlist</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="bg-white rounded-16 p-20 shadow-sm border border-gray-100 d-flex align-items-center gap-16 hover-border-main-600 transition-2">
                        <div className="bg-main-50 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                            <i className="ph ph-user-circle text-main-600 text-xl" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="text-neutral-900 text-sm fw-semibold mb-2">Edit Profile</h6>
                            <p className="text-gray-400 text-xs mb-0">Update your personal details</p>
                        </div>
                        <button type="button" className="btn btn-main py-8 px-16 rounded-8 text-xs" onClick={() => setActiveTab('profile')}>Edit</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="bg-white rounded-16 p-20 shadow-sm border border-gray-100 d-flex align-items-center gap-16 hover-border-main-600 transition-2">
                        <div className="bg-main-50 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                            <i className="ph ph-map-pin text-main-600 text-xl" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="text-neutral-900 text-sm fw-semibold mb-2">Addresses</h6>
                            <p className="text-gray-400 text-xs mb-0">Manage shipping & billing</p>
                        </div>
                        <button type="button" className="btn btn-main py-8 px-16 rounded-8 text-xs" onClick={() => setActiveTab('addresses')}>Manage</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="bg-white rounded-16 p-20 shadow-sm border border-gray-100 d-flex align-items-center gap-16 hover-border-main-600 transition-2">
                        <div className="bg-main-50 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                            <i className="ph ph-lock text-main-600 text-xl" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="text-neutral-900 text-sm fw-semibold mb-2">Password</h6>
                            <p className="text-gray-400 text-xs mb-0">Update your security settings</p>
                        </div>
                        <button type="button" className="btn btn-main py-8 px-16 rounded-8 text-xs" onClick={() => setActiveTab('password')}>Change</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <Link to="/shop" className="bg-white rounded-16 p-20 shadow-sm border border-gray-100 d-flex align-items-center gap-16 hover-border-main-600 transition-2 text-decoration-none">
                        <div className="bg-main-50 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '44px', height: '44px' }}>
                            <i className="ph ph-storefront text-main-600 text-xl" />
                        </div>
                        <div className="flex-grow-1">
                            <h6 className="text-neutral-900 text-sm fw-semibold mb-2">Shop</h6>
                            <p className="text-gray-400 text-xs mb-0">Continue browsing products</p>
                        </div>
                        <i className="ph ph-arrow-right text-main-600 text-xl" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

/* ==================== ORDERS TAB ==================== */
const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        ordersAPI.getOrders()
            .then(data => setOrders(data.orders))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="bg-white rounded-16 p-48 text-center shadow-sm border border-gray-100"><p className="text-gray-500">Loading orders...</p></div>;

    if (selectedOrder) {
        return (
            <div className="bg-white rounded-16 shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-32 py-20 border-bottom border-gray-100 d-flex align-items-center gap-16">
                    <button type="button" className="text-main-600 fw-semibold text-sm border-0 bg-transparent d-flex align-items-center gap-4" style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>
                        <i className="ph ph-arrow-left" /> Back
                    </button>
                    <h6 className="text-lg fw-bold mb-0 ms-8">Order #{selectedOrder.id}</h6>
                    <span className={`ms-auto text-xs fw-semibold px-12 py-4 rounded-pill ${selectedOrder.status === 'Delivered' ? 'bg-success-50 text-success-600' : selectedOrder.status === 'Shipped' ? 'bg-info-50 text-info-600' : 'bg-warning-50 text-warning-600'}`}>{selectedOrder.status}</span>
                </div>
                <div className="px-32 py-28">
                    <div className="rounded-8 border border-gray-100 overflow-hidden mb-24">
                        <table className="table mb-0 text-sm">
                            <thead className="bg-color-three">
                                <tr>
                                    <th className="px-16 py-12 fw-semibold text-gray-700">Product</th>
                                    <th className="px-16 py-12 fw-semibold text-gray-700 text-end">Price</th>
                                    <th className="px-16 py-12 fw-semibold text-gray-700 text-center">Qty</th>
                                    <th className="px-16 py-12 fw-semibold text-gray-700 text-end">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedOrder.items.map((item, i) => (
                                    <tr key={i} className="border-bottom border-gray-100">
                                        <td className="px-16 py-12 text-neutral-900">{item.name}</td>
                                        <td className="px-16 py-12 text-end text-gray-600">${item.price.toFixed(2)}</td>
                                        <td className="px-16 py-12 text-center text-gray-600">{item.quantity}</td>
                                        <td className="px-16 py-12 text-end fw-semibold text-neutral-900">${item.total.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <div className="bg-color-three rounded-12 p-20">
                                <h6 className="text-xs fw-bold text-gray-500 mb-12" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shipping To</h6>
                                <p className="text-sm text-neutral-900 mb-2">{selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}</p>
                                <p className="text-sm text-gray-600 mb-2">{selectedOrder.shippingAddress.street}</p>
                                <p className="text-sm text-gray-600 mb-0">{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}</p>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="bg-color-three rounded-12 p-20">
                                <h6 className="text-xs fw-bold text-gray-500 mb-12" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Summary</h6>
                                <div className="d-flex justify-content-between mb-6"><span className="text-sm text-gray-600">Subtotal</span><span className="text-sm text-neutral-900">${selectedOrder.subtotal.toFixed(2)}</span></div>
                                <div className="d-flex justify-content-between mb-6"><span className="text-sm text-gray-600">Tax</span><span className="text-sm text-neutral-900">${selectedOrder.tax.toFixed(2)}</span></div>
                                <div className="d-flex justify-content-between mb-6"><span className="text-sm text-gray-600">Shipping</span><span className="text-sm text-neutral-900">{selectedOrder.shipping === 0 ? 'Free' : `$${selectedOrder.shipping.toFixed(2)}`}</span></div>
                                <hr className="my-8" style={{ borderColor: '#ddd' }} />
                                <div className="d-flex justify-content-between"><span className="text-md fw-bold text-neutral-900">Total</span><span className="text-md fw-bold text-main-600">${selectedOrder.total.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-20 mb-0">Payment: {selectedOrder.paymentMethod} • Placed: {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-16 shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-32 py-20 border-bottom border-gray-100 d-flex align-items-center">
                <h6 className="text-lg fw-bold mb-0">My Orders</h6>
                <span className="ms-auto bg-main-50 text-main-600 text-xs fw-semibold px-12 py-4 rounded-pill">{orders.length}</span>
            </div>
            {orders.length === 0 ? (
                <div className="p-48 text-center">
                    <i className="ph ph-package text-gray-200" style={{ fontSize: '56px' }} />
                    <h6 className="text-neutral-900 text-lg mt-20 mb-8">No orders yet</h6>
                    <p className="text-gray-400 text-sm mb-20">Your order history will appear here.</p>
                    <Link to="/shop" className="btn btn-main rounded-pill py-12 px-32">Browse Shop</Link>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table mb-0 text-sm">
                        <thead className="bg-color-three">
                            <tr>
                                <th className="px-24 py-14 fw-semibold text-gray-600">Order</th>
                                <th className="px-24 py-14 fw-semibold text-gray-600">Date</th>
                                <th className="px-24 py-14 fw-semibold text-gray-600">Items</th>
                                <th className="px-24 py-14 fw-semibold text-gray-600">Status</th>
                                <th className="px-24 py-14 fw-semibold text-gray-600 text-end">Total</th>
                                <th className="px-24 py-14"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-bottom border-gray-100">
                                    <td className="px-24 py-14 fw-bold text-main-600">#{order.id}</td>
                                    <td className="px-24 py-14 text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="px-24 py-14 text-gray-600">{order.items.length}</td>
                                    <td className="px-24 py-14"><span className={`text-xs fw-semibold px-10 py-4 rounded-pill ${order.status === 'Delivered' ? 'bg-success-50 text-success-600' : order.status === 'Shipped' ? 'bg-info-50 text-info-600' : 'bg-warning-50 text-warning-600'}`}>{order.status}</span></td>
                                    <td className="px-24 py-14 text-end fw-bold text-neutral-900">${order.total.toFixed(2)}</td>
                                    <td className="px-24 py-14"><button className="text-main-600 fw-semibold text-xs border-0 bg-transparent" style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(order)}>View →</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

/* ==================== PROFILE TAB ==================== */
const ProfileTab = ({ user, updateProfile }) => {
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [displayName, setDisplayName] = useState(user.username || '');
    const [email] = useState(user.email || '');
    const [phone, setPhone] = useState(user.phone || '');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSave = async (e) => {
        e.preventDefault(); setSaving(true); setMessage(''); setError('');
        try { if (updateProfile) await updateProfile({ firstName, lastName, displayName, phone }); setMessage('Profile updated successfully!'); }
        catch (err) { setError(err.message || 'Failed to update'); }
        finally { setSaving(false); }
    };

    return (
        <div className="bg-white rounded-16 shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-32 py-20 border-bottom border-gray-100">
                <h6 className="text-lg fw-bold mb-0">Account Details</h6>
            </div>
            <div className="px-32 py-32">
                {message && <div className="bg-success-50 text-success-600 rounded-8 px-16 py-12 mb-24 text-sm fw-medium"><i className="ph ph-check-circle me-8" />{message}</div>}
                {error && <div className="bg-danger-50 text-danger rounded-8 px-16 py-12 mb-24 text-sm fw-medium"><i className="ph ph-warning me-8" />{error}</div>}
                <form onSubmit={handleSave}>
                    <div className="row g-3">
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">First Name</label>
                            <input type="text" className="common-input" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Last Name</label>
                            <input type="text" className="common-input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Display Name <span className="text-danger">*</span></label>
                            <input type="text" className="common-input" placeholder="Display Name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
                        </div>
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Phone</label>
                            <input type="tel" className="common-input" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                        <div className="col-12">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Email</label>
                            <input type="email" className="common-input bg-color-three" value={email} disabled readOnly />
                            <p className="text-xs text-gray-400 mt-6">Email cannot be changed</p>
                        </div>
                        <div className="col-12 mt-16">
                            <button type="submit" className="btn btn-main rounded-pill py-14 px-40" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

/* ==================== ADDRESSES TAB ==================== */
const AddressesTab = ({ user, updateProfile }) => {
    const [editingBilling, setEditingBilling] = useState(false);
    const [editingShipping, setEditingShipping] = useState(false);
    const [billingAddress, setBillingAddress] = useState(user.billingAddress || { street: '', city: '', state: '', zip: '', country: '' });
    const [shippingAddress, setShippingAddress] = useState(user.shippingAddress || { street: '', city: '', state: '', zip: '', country: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async (type) => {
        setSaving(true);
        try {
            if (updateProfile) await updateProfile(type === 'billing' ? { billingAddress } : { shippingAddress });
            setMessage(`${type === 'billing' ? 'Billing' : 'Shipping'} address saved!`);
            type === 'billing' ? setEditingBilling(false) : setEditingShipping(false);
        } catch (err) { /* */ }
        finally { setSaving(false); }
    };

    const AddressForm = ({ address, setAddress, onSave, onCancel }) => (
        <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            <div className="row g-3">
                <div className="col-12"><input type="text" className="common-input" placeholder="Street Address" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} /></div>
                <div className="col-6"><input type="text" className="common-input" placeholder="City" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} /></div>
                <div className="col-6"><input type="text" className="common-input" placeholder="State" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} /></div>
                <div className="col-6"><input type="text" className="common-input" placeholder="ZIP Code" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} /></div>
                <div className="col-6"><input type="text" className="common-input" placeholder="Country" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} /></div>
                <div className="col-12 d-flex gap-12 mt-12">
                    <button type="submit" className="btn btn-main rounded-pill py-10 px-24 text-sm" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                    <button type="button" className="btn btn-outline rounded-pill py-10 px-24 text-sm border border-gray-200 text-gray-600" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </form>
    );

    const AddressCard = ({ address, onEdit, label, icon }) => {
        const hasAddress = address.street || address.city;
        return (
            <div className="bg-white rounded-16 shadow-sm border border-gray-100 overflow-hidden h-100">
                <div className="px-20 py-14 border-bottom border-gray-100 bg-color-three d-flex align-items-center gap-8">
                    <i className={`${icon} text-main-600`} />
                    <h6 className="text-sm fw-bold text-neutral-900 mb-0">{label}</h6>
                </div>
                <div className="px-20 py-20">
                    {hasAddress ? (
                        <div>
                            <p className="text-sm text-neutral-900 mb-4">{address.street}</p>
                            <p className="text-sm text-gray-600 mb-4">{address.city}{address.state ? `, ${address.state}` : ''} {address.zip}</p>
                            <p className="text-sm text-gray-600 mb-16">{address.country}</p>
                            <button type="button" className="btn btn-main-two rounded-pill py-8 px-20 text-xs" onClick={onEdit}>Edit</button>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <i className="ph ph-map-pin text-gray-200 d-block mb-8" style={{ fontSize: '36px' }} />
                            <p className="text-sm text-gray-400 mb-12">No address added</p>
                            <button type="button" className="btn btn-main rounded-pill py-10 px-24 text-xs" onClick={onEdit}>Add Address</button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div>
            {message && <div className="bg-success-50 text-success-600 rounded-8 px-16 py-12 mb-24 text-sm fw-medium"><i className="ph ph-check-circle me-8" />{message}</div>}
            <div className="row g-3">
                <div className="col-md-6">
                    {editingBilling ? <div className="bg-white rounded-16 shadow-sm border border-gray-100 p-24"><h6 className="text-sm fw-bold mb-16">Edit Billing Address</h6><AddressForm address={billingAddress} setAddress={setBillingAddress} onSave={() => handleSave('billing')} onCancel={() => setEditingBilling(false)} /></div>
                    : <AddressCard address={billingAddress} onEdit={() => setEditingBilling(true)} label="Billing Address" icon="ph ph-receipt" />}
                </div>
                <div className="col-md-6">
                    {editingShipping ? <div className="bg-white rounded-16 shadow-sm border border-gray-100 p-24"><h6 className="text-sm fw-bold mb-16">Edit Shipping Address</h6><AddressForm address={shippingAddress} setAddress={setShippingAddress} onSave={() => handleSave('shipping')} onCancel={() => setEditingShipping(false)} /></div>
                    : <AddressCard address={shippingAddress} onEdit={() => setEditingShipping(true)} label="Shipping Address" icon="ph ph-truck" />}
                </div>
            </div>
        </div>
    );
};

/* ==================== PASSWORD TAB ==================== */
const PasswordTab = ({ changePassword }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault(); setMessage(''); setError('');
        if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
        if (newPassword.length < 6) { setError('Minimum 6 characters required'); return; }
        setSaving(true);
        try { if (changePassword) await changePassword(currentPassword, newPassword); setMessage('Password updated!'); setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }
        catch (err) { setError(err.message || 'Failed'); }
        finally { setSaving(false); }
    };

    return (
        <div className="bg-white rounded-16 shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-32 py-20 border-bottom border-gray-100">
                <h6 className="text-lg fw-bold mb-0">Change Password</h6>
            </div>
            <div className="px-32 py-32">
                {message && <div className="bg-success-50 text-success-600 rounded-8 px-16 py-12 mb-24 text-sm fw-medium"><i className="ph ph-check-circle me-8" />{message}</div>}
                {error && <div className="bg-danger-50 text-danger rounded-8 px-16 py-12 mb-24 text-sm fw-medium"><i className="ph ph-warning me-8" />{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                        <div className="col-12">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Current Password <span className="text-danger">*</span></label>
                            <input type="password" className="common-input" placeholder="Enter current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">New Password <span className="text-danger">*</span></label>
                            <input type="password" className="common-input" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                        </div>
                        <div className="col-sm-6">
                            <label className="text-sm fw-medium text-neutral-900 mb-8 d-block">Confirm <span className="text-danger">*</span></label>
                            <input type="password" className="common-input" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
                        </div>
                        <div className="col-12 mt-16">
                            <button type="submit" className="btn btn-main rounded-pill py-14 px-40" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountDashboard
