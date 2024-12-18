import express from 'express';
import { body, query } from 'express-validator';
import { isAuthenticated, loadUser } from '../middleware/auth';
import { createQuestion, getQuestions, getQuestionById } from '../controllers/questionController';

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
 *           default: 1
 *           minimum: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           maximum: 50
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filtrer par titre
 *       - in: query
 *         name: content
 *         schema:
 *           type: string
 *         description: Filtrer par contenu
 *       - in: query
 *         name: hasCorrectAnswer
 *         schema:
 *           type: boolean
 *         description: Filtrer les questions avec/sans réponse correcte
 *       - in: query
 *         name: minAnswers
 *         schema:
 *           type: integer
 *         description: Nombre minimum de réponses
 *       - in: query
 *         name: hasUserResponses
 *         schema:
 *           type: boolean
 *         description: Filtrer les questions avec/sans réponses utilisateur
 */
router.get('/',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
    query('title').optional().isString().trim(),
    query('content').optional().isString().trim(),
    query('hasCorrectAnswer').optional().isBoolean(),
    query('minAnswers').optional().isInt({ min: 1 }).toInt(),
    query('hasUserResponses').optional().isBoolean(),
    query('createdAt').optional().isISO8601(),
    query('updatedAt').optional().isISO8601(),
    getQuestions
);

router.get('/:id', getQuestionById);

export default router;
