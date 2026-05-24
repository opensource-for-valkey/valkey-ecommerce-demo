import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SignOut } from "@phosphor-icons/react";
import { api } from "../api";
import { useCommerce } from "../CommerceContext";
import { Input } from "../components/FormControls";
import { money, statusLabel } from "../utils/formatters";
import { useSeo } from "../useSeo";

export const AccountPage = () => {
  useSeo("Account", "Manage profile, authentication, and order history.");
  const { user, login, register, logout, setUser } = useCommerce();
  const [mode, setMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "admin@valkeycommerce.dev",
    password: "Admin123!"
  });
  const [orders, setOrders] = useState([]);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name);
    api.orders().then((response) => setOrders(response.data || [])).catch(() => setOrders([]));
  }, [user]);

  const submitAuth = async (event) => {
    event.preventDefault();
    if (mode === "login") await login(authForm);
    else await register(authForm);
  };

  const saveProfile = async () => {
    const response = await api.updateMe({ name: profileName });
    setUser(response.user);
  };

  if (!user) {
    return (
      <main className="vc-page">
        <section className="vc-auth-layout">
          <div>
            <span className="vc-eyebrow">Account</span>
            <h1>Sign in to unlock saved carts, orders, and admin tools.</h1>
            <p>
              Demo admin credentials are prefilled. Register a customer account to test
              the customer flow.
            </p>
          </div>
          <form className="vc-auth-card" onSubmit={submitAuth}>
            <div className="vc-segmented">
              <button type="button" className={mode === "login" ? "is-active" : ""} onClick={() => setMode("login")}>
                Login
              </button>
              <button type="button" className={mode === "register" ? "is-active" : ""} onClick={() => setMode("register")}>
                Register
              </button>
            </div>
            {mode === "register" && (
              <Input label="Name" value={authForm.name} onChange={(value) => setAuthForm({ ...authForm, name: value })} />
            )}
            <Input label="Email" type="email" value={authForm.email} onChange={(value) => setAuthForm({ ...authForm, email: value })} />
            <Input label="Password" type="password" value={authForm.password} onChange={(value) => setAuthForm({ ...authForm, password: value })} />
            <button className="vc-button vc-button--primary vc-button--full" type="submit">
              {mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="vc-page">
      <section className="vc-page-heading">
        <div>
          <span className="vc-eyebrow">Profile</span>
          <h1>{user.name}</h1>
          <p>{user.email} / {user.role}</p>
        </div>
        <button className="vc-button vc-button--ghost" type="button" onClick={logout}>
          <SignOut size={18} /> Sign out
        </button>
      </section>

      <section className="vc-account-grid">
        <article className="vc-panel">
          <h2>Profile</h2>
          <Input label="Display name" value={profileName} onChange={setProfileName} />
          <button className="vc-button vc-button--primary" type="button" onClick={saveProfile}>
            Save profile
          </button>
        </article>
        <article className="vc-panel">
          <h2>Order history</h2>
          {orders.length ? (
            orders.map((order) => (
              <div className="vc-order-line" key={order.id}>
                <span>{order.invoice.number}</span>
                <strong>{money(order.totals.total)}</strong>
                <small>{statusLabel(order.status)}</small>
              </div>
            ))
          ) : (
            <p>No orders yet.</p>
          )}
        </article>
        {user.role === "admin" && (
          <article className="vc-panel vc-panel--accent">
            <h2>Admin access</h2>
            <p>Manage analytics, inventory, and order operations.</p>
            <Link className="vc-button vc-button--primary" to="/admin">
              Open dashboard
            </Link>
          </article>
        )}
      </section>
    </main>
  );
};

