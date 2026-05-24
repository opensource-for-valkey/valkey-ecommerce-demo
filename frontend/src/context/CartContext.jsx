import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// Generates or retrieves a unique guest user prefix
const getOrCreateGuestUserId = () => {
    let guestId = localStorage.getItem('valkey_guest_user_id');
    if (!guestId) {
        const randPart1 = Math.random().toString(36).substring(2, 10);
        const randPart2 = Math.random().toString(36).substring(2, 10);
        guestId = `user:guest_${randPart1}${randPart2}`;
        localStorage.setItem('valkey_guest_user_id', guestId);
    }
    return guestId;
};

export const CartProvider = ({ children }) => {
    const [userId] = useState(getOrCreateGuestUserId);
    const [cartItems, setCartItems] = useState([]);
    const [cartTotals, setCartTotals] = useState({
        subtotal: 0,
        estTax: 0,
        total: 0
    });
    const [loading, setLoading] = useState(true);

    // Fetch the cart contents from the FastAPI server backed by Valkey
    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8001/api/cart?userId=${encodeURIComponent(userId)}`);
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items || []);
                setCartTotals({
                    subtotal: data.subtotal || 0,
                    estTax: data.estTax || 0,
                    total: data.total || 0
                });
            }
        } catch (error) {
            console.error('Error fetching cart from Valkey backend:', error);
        } finally {
            setLoading(false);
        }
    };

    // +++++
    const addToCart = async (product, quantity = 1) => {

        console.log("ADD TO CART CLICKED");

        const itemBody = {
            userId: userId,
            productId: product.id || `product:guest_${product.name.replace(/\s+/g, '_').toLowerCase()}`,
            name: product.name,
            price: parseFloat(product.price),
            quantity: quantity,
            imageUrl: product.imageUrl || product.image || 'assets/images/thumbs/product-two-img1.png'
        };

        console.log("Sending item:", itemBody);

        try {
            const response = await fetch('http://localhost:8001/api/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemBody),
            });

            console.log("Response status:", response.status);

            const data = await response.json();

            console.log("Backend response:", data);

            if (response.ok) {
                await fetchCart();

                window.dispatchEvent(new Event('valkey-db-updated'));

                return true;
            }

        } catch (error) {
            console.error('Error adding item to Valkey cart:', error);
        }

        return false;
    };

    // +++
    // Update quantity of a specific item in the Valkey cart
    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            const response = await fetch(`http://localhost:8001/api/cart/items/${encodeURIComponent(productId)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    quantity: quantity
                }),
            });

            if (response.ok) {
                await fetchCart();
                window.dispatchEvent(new Event('valkey-db-updated'));
                return true;
            }
        } catch (error) {
            console.error('Error updating Valkey cart quantity:', error);
        }
        return false;
    };

    // Delete a specific item from the Valkey cart
    const removeFromCart = async (productId) => {
        try {
            const response = await fetch(
                `http://localhost:8001/api/cart/items/${encodeURIComponent(productId)}?userId=${encodeURIComponent(userId)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                await fetchCart();
                window.dispatchEvent(new Event('valkey-db-updated'));
                return true;
            }
        } catch (error) {
            console.error('Error removing item from Valkey cart:', error);
        }
        return false;
    };

    // Delete the entire cart from Valkey
    const clearCart = async () => {
        try {
            const response = await fetch(
                `http://localhost:8001/api/cart?userId=${encodeURIComponent(userId)}`,
                { method: 'DELETE' }
            );

            if (response.ok) {
                setCartItems([]);
                setCartTotals({ subtotal: 0, estTax: 0, total: 0 });
                window.dispatchEvent(new Event('valkey-db-updated'));
                return true;
            }
        } catch (error) {
            console.error('Error clearing Valkey cart:', error);
        }
        return false;
    };

    // On mount, load the cart and setup global click listener for "Add To Cart" buttons
    useEffect(() => {
        fetchCart();

        // // const handleGlobalAddToCart = async (e) => {
        //     const btn = e.target.closest('.product-card__cart');
        //     // Check if it's an "Add to Cart" action and not on the cart page itself
        //     if (btn && window.location.pathname !== '/cart') {
        //         e.preventDefault();

        //         const productCard = btn.closest('.product-card') || btn.closest('.table-product') || btn.closest('div[class*="product-card"]');
        //         if (productCard) {
        //             // 1. Extract product name
        //             const titleEl = productCard.querySelector('.title a, .product-card__content .title, .title, h6');
        //             const name = titleEl ? titleEl.textContent.trim() : 'Organic Premium Product';

        //             // 2. Extract image URL
        //             const imgEl = productCard.querySelector('.product-card__thumb img, img');
        //             const imageUrl = imgEl ? imgEl.getAttribute('src') : 'assets/images/thumbs/product-two-img1.png';

        //             // 3. Extract price (handling formats like $125.00)
        //             const priceEl = productCard.querySelector('.product-card__price .text-heading, .product-card__price span:not(.text-decoration-line-through), td span[class*="fw-semibold"]');
        //             let price = 14.99;
        //             if (priceEl) {
        //                 const priceText = priceEl.textContent;
        //                 const match = priceText.match(/\d+(\.\d+)?/);
        //                 if (match) {
        //                     price = parseFloat(match[0]);
        //                 }
        //             } else {
        //                 // Fallback: search anywhere in card for dollar price
        //                 const textContent = productCard.textContent;
        //                 const match = textContent.match(/\$\s*(\d+(\.\d+)?)/);
        //                 if (match) {
        //                     price = parseFloat(match[1]);
        //                 }
        //             }

        //             // Generate a clean UUIDv7-style prefixed ID for the product
        //             const productId = `product:${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

        //             console.log('Intercepted Add to Cart:', { productId, name, price, imageUrl });

        //             // Add to Valkey cart
        //             const success = await addToCart({
        //                 id: productId,
        //                 name: name,
        //                 price: price,
        //                 imageUrl: imageUrl
        //             }, 1);

        //             if (success) {
        //                 // Redirect to dynamic cart view
        //                 window.location.href = '/cart';
        //             }
        //         }
        //     }
        // };
        const handleGlobalAddToCart = async (e) => {

            const btn = e.target.closest('button, a');

            if (!btn) return;

            const btnText = btn.innerText?.toLowerCase() || '';

            if (
                btnText.includes('add to cart') ||
                btn.className.includes('product-card__cart')
            ) {

                e.preventDefault();

                console.log("ADD TO CART BUTTON DETECTED");

                const productCard =
                    btn.closest('.product-card') ||
                    btn.closest('[class*="product"]');

                if (!productCard) {
                    console.log("PRODUCT CARD NOT FOUND");
                    return;
                }

                // PRODUCT NAME
                const titleEl =
                    productCard.querySelector('.title') ||
                    productCard.querySelector('h6') ||
                    productCard.querySelector('h5') ||
                    productCard.querySelector('a');

                const name = titleEl
                    ? titleEl.textContent.trim()
                    : 'Demo Product';

                // PRICE
                let price = 99;

                const priceText = productCard.innerText;
                const priceMatch = priceText.match(/\$?\s?(\d+(\.\d+)?)/);

                if (priceMatch) {
                    price = parseFloat(priceMatch[1]);
                }

                // IMAGE
                const imgEl = productCard.querySelector('img');

                const imageUrl = imgEl
                    ? imgEl.src
                    : '';

                const productId =
                    'product-' +
                    name.toLowerCase().replace(/[^a-z0-9]/g, '-');

                console.log("PRODUCT FOUND:", {
                    productId,
                    name,
                    price,
                    imageUrl
                });

                const success = await addToCart({
                    id: productId,
                    name,
                    price,
                    imageUrl
                }, 1);

                console.log("ADD TO CART RESULT:", success);

                if (success) {
                    alert("Product added to Valkey DB!");
                }
            }
        };

        document.addEventListener('click', handleGlobalAddToCart);
        return () => {
            document.removeEventListener('click', handleGlobalAddToCart);
        };
    }, []);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            userId,
            cartItems,
            cartTotals,
            cartCount,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            clearCart,
            refreshCart: fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
