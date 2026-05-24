# API Reference

Base URL: `/api/v1`

## Health

`GET /health`

Returns API status and Valkey mode.

## Products

`GET /products`

Query params:

- `search` or `q`
- `category`
- `brand`
- `subcategory`
- `tag`
- `minPrice`
- `maxPrice`
- `rating`
- `sort`: `featured`, `trending`, `price-asc`, `price-desc`, `rating`, `newest`
- `page`
- `limit`

`GET /products/:id`

Returns product details, three-image galleries, related products, reviews, and cache metadata.

`GET /products/trending?limit=6`

Returns Valkey hot products with sold-count fallback.

`GET /products/suggestions?q=term`

Returns search suggestions.

`GET /products/recently-viewed`

Returns recently viewed products for the user or anonymous session.

## Auth

`POST /auth/register`

```json
{
  "name": "Customer",
  "email": "customer@example.com",
  "password": "Password123"
}
```

`POST /auth/login`

```json
{
  "email": "admin@valkeycommerce.dev",
  "password": "Admin123!"
}
```

`GET /auth/me`

Requires `Authorization: Bearer <token>`.

`PATCH /auth/me`

Updates profile data.

`POST /auth/logout`

Revokes the Valkey-backed session.

## Cart

Anonymous carts use `x-session-id`; signed-in carts use the authenticated user id.

`GET /cart`

`POST /cart/items`

```json
{
  "productId": "pulse-anc-earbuds-pro",
  "quantity": 1,
  "variantId": "graphite"
}
```

`PATCH /cart/items/:productId`

```json
{
  "quantity": 2,
  "variantId": "graphite"
}
```

`DELETE /cart/items/:productId`

`POST /cart/coupon`

```json
{
  "code": "VALKEY10"
}
```

`DELETE /cart`

## Wishlist

`GET /wishlist`

`POST /wishlist/:productId`

`DELETE /wishlist/:productId`

## Orders

`GET /orders`

`POST /orders/checkout`

```json
{
  "paymentProvider": "stripe-placeholder",
  "customer": {
    "name": "Customer",
    "email": "customer@example.com",
    "phone": "5551234567"
  },
  "shippingAddress": {
    "line1": "123 Market Street",
    "line2": "Suite 400",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105",
    "country": "US"
  }
}
```

`GET /orders/:orderId`

## Admin

Admin routes require an admin JWT.

`GET /admin/analytics`

Returns product count, low stock count, average rating, revenue signal, category mix, and trending products.

`PATCH /admin/inventory/:productId`

```json
{
  "delta": -1
}
```

`PATCH /admin/orders/:orderId/status`

```json
{
  "status": "shipped"
}
```
