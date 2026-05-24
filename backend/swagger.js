const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Valkey E-Commerce API',
      version: '1.0.0',
      description: 'REST API for the Valkey-powered e-commerce demo',
    },
    servers: [{ url: 'http://localhost:4000', description: 'Local dev' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'UUID',
          description: 'Session token returned by /register or /login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user:0192d4e0-1234-7abc-def0-111122223333' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            firstName: { type: 'string', example: 'Jane' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', nullable: true, example: '+91 9876543210' },
            role: { type: 'string', example: 'customer' },
            addresses: { type: 'array', items: { type: 'object' } },
            preferences: {
              type: 'object',
              properties: {
                currency: { type: 'string', example: 'INR' },
                language: { type: 'string', example: 'en' },
                notifications: { type: 'boolean', example: true },
              },
            },
            createdAt: { type: 'string', format: 'date-time' },
            lastLoginAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'validation_error' },
            message: { type: 'string', example: 'Email and password are required' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'product:0192d4e6-2c4e-7a6b-8d8f-0a1b2c3d4e5f' },
            sku: { type: 'string', example: 'ELEC-PHN-SAM-001' },
            name: { type: 'string', example: 'Galaxy Ultra Pro 256GB' },
            slug: { type: 'string', example: 'galaxy-ultra-pro-256gb' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            categoryId: { type: 'string' },
            vendorId: { type: 'string' },
            brand: { type: 'string', example: 'Samsung' },
            price: {
              type: 'object',
              properties: {
                amount: { type: 'integer', example: 89999 },
                currency: { type: 'string', example: 'INR' },
                compareAt: { type: 'integer', nullable: true, example: 99999 },
              },
            },
            images: { type: 'array', items: { type: 'object' } },
            attributes: { type: 'object' },
            tags: { type: 'array', items: { type: 'string' } },
            inventory: {
              type: 'object',
              properties: {
                quantity: { type: 'integer' },
                reserved: { type: 'integer' },
                warehouse: { type: 'string' },
              },
            },
            ratings: {
              type: 'object',
              properties: {
                average: { type: 'number' },
                count: { type: 'integer' },
              },
            },
            status: { type: 'string', example: 'active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'category:0192d4e2-1f5a-7c3d-9b2e-8a4f6d0c1e3b' },
            name: { type: 'string', example: 'Electronics' },
            slug: { type: 'string', example: 'electronics' },
            icon: { type: 'string', example: 'desktop' },
            parentId: { type: 'string', nullable: true },
            children: { type: 'array', items: { $ref: '#/components/schemas/Category' } },
          },
        },
        Vendor: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'vendor:0192d4e7-4d5e-7b7c-9e9f-1a2b3c4d5e6f' },
            name: { type: 'string', example: 'TechWorld Electronics' },
            slug: { type: 'string', example: 'techworld-electronics' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            logo: { type: 'string' },
            rating: { type: 'number' },
            totalProducts: { type: 'integer' },
            totalSales: { type: 'integer' },
            address: { type: 'object' },
            verified: { type: 'boolean' },
            joinedAt: { type: 'string', format: 'date-time' },
          },
        },
        Cart: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  brand: { type: 'string' },
                  price: { type: 'integer' },
                  quantity: { type: 'integer' },
                  subtotal: { type: 'integer' },
                  image: { type: 'string', nullable: true },
                  categoryId: { type: 'string' },
                },
              },
            },
            itemCount: { type: 'integer' },
            subtotal: { type: 'integer' },
            discount: { type: 'integer' },
            total: { type: 'integer' },
            coupon: {
              nullable: true,
              type: 'object',
              properties: {
                code: { type: 'string' },
                type: { type: 'string', enum: ['percentage', 'fixed'] },
                value: { type: 'number' },
                discount: { type: 'integer' },
                description: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

module.exports = swaggerJsdoc(options);
