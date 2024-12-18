import express from 'express';
import { body } from 'express-validator';
import { isAuthenticated, loadUser } from '../middleware/auth';
import { createQuestion, getQuestions } from '../controllers/questionController';

const router = express.Router();

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Crée une nouvelle question avec ses réponses
 *     tags: [Questions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 */
router.post('/',
    isAuthenticated,
    loadUser,
    [
        body("title").isString().trim().escape().notEmpty(),
        body("content").isString().trim().escape().notEmpty(),
        body("answers").isArray({min: 2}).notEmpty(),
        body("answers.*.content").isString().trim().escape().notEmpty(),
        body("answers.*.is_correct").isBoolean(),
    ],
    createQuestion
);

/**
 * @swagger
 * /api/questions:
 *   get:
 *     summary: Récupère la liste des questions
 *     tags: [Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 */
router.get('/', getQuestions);

export default router;
