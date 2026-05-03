import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "First PSQL API",
    version: "1.0.0",
    description: "API documentation for auth, user, and admin modules",
  },
  servers: [
    {
      url: "http://localhost:5000/api/v1",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "admin@example.com" },
          password: { type: "string", example: "123456" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "Login successfully" },
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
              id: { type: "string", format: "uuid" },
              email: { type: "string", format: "email" },
              role: { type: "string", example: "ADMIN" },
              needPasswordChange: { type: "boolean" },
              status: { type: "string", example: "ACTIVE" },
            },
          },
        },
      },
      RefreshTokenResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: true },
          message: {
            type: "string",
            example: "Access token refreshed successfully",
          },
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string" },
            },
          },
        },
      },
      CreateAdminRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "John Admin" },
          email: { type: "string", format: "email", example: "john@admin.com" },
          password: { type: "string", example: "123456" },
          contactNumber: { type: "string", example: "01712345678" },
        },
      },
      UpdateAdminRequest: {
        type: "object",
        properties: {
          name: { type: "string", example: "Updated Admin" },
          profilePhoto: { type: "string", example: "https://example.com/photo.jpg" },
          contactNumber: { type: "string", example: "01712345678" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          success: { type: "boolean", example: false },
          statusCode: { type: "number", example: 400 },
          message: { type: "string", example: "Validation failed" },
        },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginResponse" },
              },
            },
          },
          "401": { description: "Invalid credentials" },
        },
      },
    },
    "/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token using refreshToken cookie",
        responses: {
          "200": {
            description: "Token refreshed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RefreshTokenResponse" },
              },
            },
          },
          "401": { description: "Refresh token missing or invalid" },
        },
      },
    },
    "/users": {
      post: {
        tags: ["Users"],
        summary: "Create admin user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateAdminRequest" },
            },
          },
        },
        responses: {
          "201": { description: "Admin created successfully" },
          "400": { description: "Validation error" },
        },
      },
    },
    "/admins": {
      get: {
        tags: ["Admins"],
        summary: "Get all admins",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Admins fetched successfully" },
          "401": { description: "Unauthorized" },
        },
      },
    },
    "/admins/{id}": {
      get: {
        tags: ["Admins"],
        summary: "Get single admin",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Admin fetched successfully" },
          "404": { description: "Admin not found" },
        },
      },
      patch: {
        tags: ["Admins"],
        summary: "Update admin",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAdminRequest" },
            },
          },
        },
        responses: {
          "200": { description: "Admin updated successfully" },
        },
      },
      delete: {
        tags: ["Admins"],
        summary: "Hard delete admin",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Admin deleted successfully" },
        },
      },
    },
    "/admins/soft/{id}": {
      delete: {
        tags: ["Admins"],
        summary: "Soft delete admin",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          "200": { description: "Admin soft deleted successfully" },
        },
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);

