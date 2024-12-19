import { Router } from 'express';
import { query } from 'express-validator';
import { getEvents, getEventById, getEventResults } from '../controllers/eventController';

const router = Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Récupère une liste d'événements
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: La page à récupérer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 200
 *           maximum: 200
 *         description: Le nombre d'événements par page
 *       - in: query
 *         name: sport
 *         schema:
 *           type: string
 *         description: Filtrer par sport
 *       - in: query
 *         name: event
 *         schema:
 *           type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: games
 *         schema:
 *           type: string
 *         description: Filtrer par jeux olympiques
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: Filtrer par saison
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filtrer par ville
 */
router.get('/', 
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ max: 200 }).toInt(),
    query(['sport', 'event', 'games', 'year', 'season', 'city']).optional().escape(),
    getEvents
);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Récupère les détails d'un événement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement
 */
router.get('/:id', getEventById);

/**
 * @swagger
 * /api/events/{id}/results:
 *   get:
 *     summary: Récupère les résultats d'un événement
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'événement
 */
router.get('/:id/results', getEventResults);

export default router;
