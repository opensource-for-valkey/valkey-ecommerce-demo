import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.valkey import valkey_client, seed_mock_data

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_and_seed_db():
    """Fixture to reset the Valkey database and re-seed clean mock data before each test."""
    valkey_client.flushdb()
    seed_mock_data()
    yield

def test_cart_operations():
    user_headers = {"X-User-Id": "user:test-cart-user"}

    # 1. Fetch initial cart (should be empty)
    response = client.get("/api/cart", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 0
    assert data["subtotal"] == 0
    assert data["total"] == 0

    # 2. Add product to cart
    add_payload = {
        "productId": "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f",
        "quantity": 2
    }
    response = client.post("/api/cart/items", json=add_payload, headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 1
    assert data["items"][0]["productId"] == "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f"
    assert data["items"][0]["quantity"] == 2
    assert data["subtotal"] == 89999 * 2
    assert data["total"] == 89999 * 2

    # 3. Update quantity (increment to 5)
    update_payload = {"quantity": 5}
    response = client.patch(
        "/api/cart/items/product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f",
        json=update_payload,
        headers=user_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["items"][0]["quantity"] == 5
    assert data["subtotal"] == 89999 * 5

    # 4. Remove item from cart
    response = client.delete(
        "/api/cart/items/product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f",
        headers=user_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 0
    assert data["subtotal"] == 0

def test_coupon_validation():
    user_headers = {"X-User-Id": "user:test-coupon-user"}
    prod_id = "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f"

    # Add item to cart first
    client.post("/api/cart/items", json={"productId": prod_id, "quantity": 1}, headers=user_headers)

    # 1. Apply invalid coupon
    response = client.post("/api/cart/coupon", json={"code": "FAKECODE"}, headers=user_headers)
    assert response.status_code == 404

    # 2. Apply valid coupon (VALKEY10 - 10% off, minimum order 50000)
    response = client.post("/api/cart/coupon", json={"code": "VALKEY10"}, headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["couponCode"] == "VALKEY10"
    assert data["subtotal"] == 89999
    assert data["discount"] == 8999  # 10% of 89999
    assert data["total"] == 89999 - 8999

    # 3. Remove coupon
    response = client.delete("/api/cart/coupon", headers=user_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["couponCode"] is None
    assert data["discount"] == 0
    assert data["total"] == 89999

def test_checkout_flow_and_idempotency():
    user_id = "user:test-checkout-user"
    user_headers = {
        "X-User-Id": user_id,
        "X-Idempotency-Key": "idemp-test-key-123"
    }
    prod_id = "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f"

    # 1. Setup cart
    client.post("/api/cart/items", json={"productId": prod_id, "quantity": 2}, headers=user_headers)
    client.post("/api/cart/coupon", json={"code": "VALKEY10"}, headers=user_headers)

    # Verify inventory in database before reservation
    prod_before = valkey_client.json().get(prod_id)
    assert prod_before["inventory"]["quantity"] == 150
    assert prod_before["inventory"]["reserved"] == 0

    # 2. Start Checkout (requires X-Idempotency-Key)
    checkout_payload = {
        "shippingAddress": {
            "street": "42 MG Road, Banjara Hills",
            "city": "Hyderabad",
            "state": "Telangana",
            "postalCode": "500034",
            "country": "IN"
        }
    }
    response = client.post("/api/checkout/start", json=checkout_payload, headers=user_headers)
    assert response.status_code == 200
    order_data = response.json()
    order_id = order_data["id"]
    assert order_data["status"] == "pending"
    assert order_data["discount"] == 10000  # Capped at maxDiscount (10000 paise)
    
    # 3. Verify stock is reserved in database
    prod_after_reserve = valkey_client.json().get(prod_id)
    assert prod_after_reserve["inventory"]["quantity"] == 150
    assert prod_after_reserve["inventory"]["reserved"] == 2
    
    # Verify temporary reservation exists in Valkey with TTL
    res_key = f"reservation:{order_id}:{prod_id}"
    assert valkey_client.exists(res_key)
    assert int(valkey_client.get(res_key)) == 2

    # 4. Check Idempotency (call start_checkout again with the same key)
    response_dup = client.post("/api/checkout/start", json=checkout_payload, headers=user_headers)
    assert response_dup.status_code == 200
    order_data_dup = response_dup.json()
    assert order_data_dup["id"] == order_id
    
    # Confirm reserved stock did not double-count
    prod_after_dup = valkey_client.json().get(prod_id)
    assert prod_after_dup["inventory"]["reserved"] == 2

    # 5. Confirm Order (Mock Payment)
    confirm_payload = {
        "orderId": order_id,
        "paymentMethod": "upi",
        "transactionId": "txn_test_12345"
    }
    response_confirm = client.post("/api/checkout/confirm", json=confirm_payload, headers=user_headers)
    assert response_confirm.status_code == 200
    confirm_data = response_confirm.json()
    assert confirm_data["status"] == "confirmed"
    assert confirm_data["payment"]["status"] == "captured"

    # 6. Verify inventory levels are permanently adjusted
    prod_after_confirm = valkey_client.json().get(prod_id)
    assert prod_after_confirm["inventory"]["quantity"] == 148
    assert prod_after_confirm["inventory"]["reserved"] == 0
    assert not valkey_client.exists(res_key)  # temporary reservation deleted

    # 7. Verify cart is cleared
    response_cart = client.get("/api/cart", headers=user_headers)
    assert len(response_cart.json()["items"]) == 0

    # 8. Verify coupon usage incremented
    coupon_data = valkey_client.json().get("coupon:VALKEY10")
    assert coupon_data["usedCount"] == 1
    assert valkey_client.sismember("coupon_used:VALKEY10", user_id)

def test_insufficient_inventory_oversell():
    user_headers_1 = {"X-User-Id": "user:customer-1"}
    user_headers_2 = {"X-User-Id": "user:customer-2"}
    
    prod_id = "product:0192d4e6-3d5f-7b8c-9e0a-1b2c3d4e5f6a"  # Initial stock = 10

    # 1. Customer 1 adds 8 items
    response = client.post("/api/cart/items", json={"productId": prod_id, "quantity": 8}, headers=user_headers_1)
    assert response.status_code == 200

    # 2. Customer 2 tries to add 5 items (stock is 10, available is 10 - 0 = 10, but wait, reserved is still 0.
    # Cart add checks available inventory (10). 5 <= 10 succeeds.
    response = client.post("/api/cart/items", json={"productId": prod_id, "quantity": 5}, headers=user_headers_2)
    assert response.status_code == 200

    # 3. Customer 1 starts checkout, reserving 8 items
    checkout_payload = {
        "shippingAddress": {
            "street": "1 Main St",
            "city": "Hyderabad",
            "state": "Telangana",
            "postalCode": "500001",
            "country": "IN"
        }
    }
    response_co1 = client.post(
        "/api/checkout/start", 
        json=checkout_payload, 
        headers={**user_headers_1, "X-Idempotency-Key": "idem-key-cust-1"}
    )
    assert response_co1.status_code == 200
    
    # 4. Customer 2 tries to checkout 5 items. Available is now 10 - 8 = 2.
    # The Lua script should catch this atomically and reject the reservation!
    response_co2 = client.post(
        "/api/checkout/start", 
        json=checkout_payload, 
        headers={**user_headers_2, "X-Idempotency-Key": "idem-key-cust-2"}
    )
    assert response_co2.status_code == 400
    assert "Insufficient stock" in response_co2.json()["detail"]

    # Verify inventory reservation was rejected
    prod = valkey_client.json().get(prod_id)
    assert prod["inventory"]["reserved"] == 8  # Only customer 1's 8 items are reserved

def test_cancel_checkout_releases_reservation():
    user_headers = {
        "X-User-Id": "user:cancel-test-user",
        "X-Idempotency-Key": "idem-cancel-key"
    }
    prod_id = "product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f"

    # Add items and start checkout
    client.post("/api/cart/items", json={"productId": prod_id, "quantity": 3}, headers=user_headers)
    checkout_payload = {
        "shippingAddress": {
            "street": "1 Main St",
            "city": "Hyderabad",
            "state": "Telangana",
            "postalCode": "500001",
            "country": "IN"
        }
    }
    response = client.post("/api/checkout/start", json=checkout_payload, headers=user_headers)
    order_id = response.json()["id"]

    # Verify reserved count is 3
    prod_reserved = valkey_client.json().get(prod_id)
    assert prod_reserved["inventory"]["reserved"] == 3

    # Cancel order
    response_cancel = client.post(f"/api/checkout/cancel?order_id_req={order_id}", headers=user_headers)
    assert response_cancel.status_code == 200
    assert response_cancel.json()["status"] == "cancelled"

    # Verify reserved count is released back to 0
    prod_released = valkey_client.json().get(prod_id)
    assert prod_released["inventory"]["reserved"] == 0
    assert not valkey_client.exists(f"reservation:{order_id}:{prod_id}")
