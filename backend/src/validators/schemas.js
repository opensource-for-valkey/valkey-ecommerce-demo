import { z } from "zod";

const optionalNumberString = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => (value === undefined || value === "" ? undefined : Number(value)));

export const productListSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    search: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    subcategory: z.string().optional(),
    tag: z.string().optional(),
    minPrice: optionalNumberString,
    maxPrice: optionalNumberString,
    rating: optionalNumberString,
    sort: z
      .enum(["featured", "trending", "price-asc", "price-desc", "rating", "newest"])
      .optional(),
    page: optionalNumberString,
    limit: optionalNumberString
  }),
  body: z.object({}).optional(),
  params: z.object({}).optional()
});

export const productIdSchema = z.object({
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional(),
  body: z.object({}).optional()
});

export const authRegisterSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const authLoginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const cartItemSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99).default(1),
    variantId: z.string().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const cartUpdateSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0).max(99),
    variantId: z.string().nullable().optional()
  }),
  params: z.object({
    productId: z.string().min(1)
  }),
  query: z.object({}).optional()
});

export const couponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(32)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const checkoutSchema = z.object({
  body: z.object({
    paymentProvider: z.string().optional(),
    customer: z.object({
      name: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7)
    }),
    shippingAddress: z.object({
      line1: z.string().min(4),
      line2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postalCode: z.string().min(3),
      country: z.string().min(2)
    })
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    addresses: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z.string().min(1),
          line1: z.string().min(4),
          line2: z.string().optional(),
          city: z.string().min(2),
          state: z.string().min(2),
          postalCode: z.string().min(3),
          country: z.string().min(2)
        })
      )
      .optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const inventorySchema = z.object({
  params: z.object({ productId: z.string().min(1) }),
  body: z.object({
    delta: z.number().int().min(-500).max(500)
  }),
  query: z.object({}).optional()
});

export const orderStatusSchema = z.object({
  params: z.object({ orderId: z.string().min(1) }),
  body: z.object({
    status: z.enum(["processing", "packed", "shipped", "out_for_delivery", "delivered", "cancelled"])
  }),
  query: z.object({}).optional()
});
