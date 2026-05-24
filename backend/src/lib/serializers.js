// Map raw SQLite rows into the camelCase shapes from HACKATHON.md.

function safeJson(value, fallback) {
    if (value == null) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function serializeCategory(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        icon: row.icon,
        parentId: row.parent_id,
        children: [],
    };
}

function serializeVendor(row) {
    if (!row) return null;
    return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        email: row.email,
        phone: row.phone,
        logo: row.logo,
        rating: row.rating,
        address: safeJson(row.address, null),
        verified: !!row.verified,
        joinedAt: row.joined_at,
    };
}

function serializeProduct(row) {
    if (!row) return null;
    return {
        id: row.id,
        sku: row.sku,
        name: row.name,
        slug: row.slug,
        description: row.description,
        shortDescription: row.short_description,
        categoryId: row.category_id,
        vendorId: row.vendor_id,
        brand: row.brand,
        price: {
            amount: row.price_amount,
            currency: row.price_currency,
            compareAt: row.price_compare_at,
        },
        images: safeJson(row.images, []),
        attributes: safeJson(row.attributes, {}),
        tags: safeJson(row.tags, []),
        inventory: {
            quantity: row.inventory_quantity,
            reserved: row.inventory_reserved,
            warehouse: row.inventory_warehouse,
        },
        ratings: {
            average: row.ratings_average,
            count: row.ratings_count,
        },
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

module.exports = { safeJson, serializeCategory, serializeVendor, serializeProduct };
