import swaggerJSDocs from "swagger-jsdoc";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const SWAGGER_OPTIONS = {
    failOnErrors: true,
    definition: {
        openapi: "3.0.0",
        info: {
            title: "GoofyOlympics API Documentation",
            version: "1.0.0",
            description: "Documentation de l'API GoofyOlympics"
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server"
            }
        ],
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
    apis: [
        join(__dirname, '../routes/*.ts'),
        join(__dirname, '../index.ts')
    ],
};

export const swaggerSpec = swaggerJSDocs(SWAGGER_OPTIONS);
