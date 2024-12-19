import {Request, Response, Router} from 'express';
import {body, matchedData, validationResult} from 'express-validator';
import bcrypt from 'bcrypt';
import {PrismaClient, users} from '@prisma/client'

type User = users;

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Enregistre un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec un email, un mot de passe et une région
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: password123
 *               region:
 *                 type: string
 *                 description: La région de l'utilisateur
 *                 example: FRA
 *     responses:
 *       200:
 *         description: L'utilisateur a été créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: User created
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     region:
 *                       type: string
 *                       example: FRA
 *       403:
 *         description: L'enregistrement est actuellement fermé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/register",
    body("email")
        .isEmail()
        .trim()
        .escape()
        .custom(async (value) => {
            let user: User | null;

            try {
                user = await prisma.users.findUnique({
                    where: {
                        mail: value
                    }
                });
            } catch (error) {
                console.error("Error executing query", error.stack);
                return Promise.reject("Internal Server Error");
            }

            if (user) {
                return Promise.reject("Email already in use");
            }
        }),
    body("password").isLength({min: 6}).escape(),
    body("region").optional().isString().trim().escape(),
    async (req: Request, res: Response) => {
        const IS_REGISTER_OPEN = process.env.IS_REGISTER_OPEN || true;

        if (!IS_REGISTER_OPEN) {
            return res.status(403).send("Forbidden");
        }

        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);

            try {
                const existingUser = await prisma.users.findUnique({
                    where: {
                        mail: data.email
                    }
                });
                if (existingUser) {
                    return res.status(400).send("Email already in use");
                }

                const user = await prisma.users.create({
                    data: {
                        mail: data.email,
                        password: await bcrypt.hash(data.password, 10),
                        region: data.region
                    },
                });

                return res.json({
                    status: "User created",
                    user: {
                        email: user.mail,
                        region: user.region
                    }
                });
            } catch (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal Server Error");
            }
        }
        return res.send({errors: result.array()});
    }
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecte un utilisateur existant
 *     description: Connecte un utilisateur avec un email et un mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: password123
 *     responses:
 *       200:
 *         description: L'utilisateur est connecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Logged in
 *       401:
 *         description: Non autorisé
 *       500:
 *         description: Erreur interne du serveur
 */
router.post("/login",
    body("email").isEmail().trim().escape(),
    body("password").isLength({min: 6}).escape(),
    async (req: Request, res: Response) => {
        const result = validationResult(req);
        if (result.isEmpty()) {
            const data = matchedData(req);

            let user: User | null;
            try {
                user = await prisma.users.findUnique({
                    where: {
                        mail: data.email
                    }
                });
            } catch (error) {
                console.error("Error executing query", error.stack);
                return res.status(500).send("Internal Server Error");
            }

            if (user) {
                const match = await bcrypt.compare(
                    data.password,
                    user.password
                );
                if (match) {
                    // @ts-expect-error - Session not typed on Request
                    req.session.userId = user.id;
                    return res.send("Logged in");
                }
            }

            return res.status(401).send({
                status: "Unauthorized",
                reason: "Invalid email or password",
            });
        }
        return res.send({errors: result.array()});
    }
);

export default router;
