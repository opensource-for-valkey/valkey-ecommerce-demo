import { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

/**
 * CartInterceptor - Intercepts "Add to Cart" link clicks.
 * Shows a toast notification and updates cart without navigating away.
 * If not logged in, redirects to /account.
 */
const CartInterceptor = () => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [toast, setToast] = useState(null);

    const userRef = useRef(user);
    const addToCartRef = useRef(addToCart);
    const navigateRef = useRef(navigate);

    useEffect(() => { userRef.current = user; }, [user]);
    useEffect(() => { addToCartRef.current = addToCart; }, [addToCart]);
    useEffect(() => { navigateRef.current = navigate; }, [navigate]);

    useEffect(() => {
        function handleClick(e) {
            const link = e.target.closest('a[href="/cart"]');
            if (!link) return;

            const text = link.textContent.toLowerCase();
            if (!text.includes('add to cart')) return;
            if (link.closest('.item-hover-two')) return;

            // Prevent React Router navigation
            e.preventDefault();
            e.stopPropagation();

            // Auth gate
            if (!userRef.current) {
                navigateRef.current('/account');
                return;
            }

            // Extract product from card
            const card = link.closest('.product-card') || link.parentElement;
            let name = 'Product Item';
            let price = 14.99;
            let image = '';

            if (card) {
                const nameEl = card.querySelector('.title a') || card.querySelector('h6 a') || card.querySelector('.title') || card.querySelector('h6');
                if (nameEl) name = nameEl.textContent.trim();

                const priceContainer = card.querySelector('.product-card__price');
                const searchIn = priceContainer ? priceContainer.querySelectorAll('span') : card.querySelectorAll('span');
                for (const s of searchIn) {
                    if (s.classList.contains('text-decoration-line-through')) continue;
                    const m = s.textContent.match(/\$(\d+\.?\d*)/);
                    if (m) { price = parseFloat(m[1]); break; }
                }

                const img = card.querySelector('img');
                if (img) image = img.src || '';
            }

            const productId = 'prod-' + name.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
            addToCartRef.current({ productId, name, price, quantity: 1, image });

            // Show toast
            setToast(name);
            setTimeout(() => setToast(null), 2500);
        }

        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);

    // Toast notification
    if (toast) {
        return (
            <div style={{
                position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
                background: '#1f2937', color: '#fff', padding: '16px 24px',
                borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'slideUp 0.3s ease', maxWidth: '360px'
            }}>
                <i className="ph-fill ph-check-circle" style={{ color: '#4ade80', fontSize: '20px' }} />
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>Added to cart!</p>
                    <p style={{ margin: 0, fontSize: '12px', opacity: 0.7, marginTop: '2px' }}>{toast}</p>
                </div>
                <button onClick={() => navigateRef.current('/cart')} style={{
                    background: 'var(--main-600, #FA6400)', color: '#fff', border: 'none',
                    padding: '6px 14px', borderRadius: '6px', fontSize: '12px',
                    fontWeight: 600, cursor: 'pointer'
                }}>
                    View Cart
                </button>
            </div>
        );
    }

    return null;
};

export default CartInterceptor;
