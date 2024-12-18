import swaggerJSDocs from "swagger-jsdoc";

export const SWAGGER_OPTIONS = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "API Documentation",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "connect.sid"
                }
            }
        }
    },
    apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDocs(SWAGGER_OPTIONS);
