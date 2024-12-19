import { Router } from 'express';
import { query } from 'express-validator';
import { getAthletes, getAthleteById, getAthleteEvents } from '../controllers/athleteController';

const router = Router();

/**
 * @swagger
 * /api/athletes:
 *   get:
 *     summary: Récupère une liste d'athlètes
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
 *           default: 10
 *           maximum: 50
 *         description: Le nombre d'athlètes par page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrer par nom
 *       - in: query
 *         name: sex
 *         schema:
 *           type: string
 *         description: Filtrer par sexe
 *       - in: query
 *         name: team
 *         schema:
 *           type: string
 *         description: Filtrer par équipe
 *       - in: query
 *         name: noc
 *         schema:
 *           type: string
 *         description: Filtrer par NOC
 */
router.get('/',
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ max: 50 }).toInt(),
    query(['name', 'sex', 'team', 'noc']).optional().escape(),
    getAthletes
);

/**
 * @swagger
 * /api/athletes/{id}:
 *   get:
 *     summary: Récupère les détails d'un athlète
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'athlète
 */
router.get('/:id', getAthleteById);

/**
 * @swagger
 * /api/athletes/{id}/events:
 *   get:
 *     summary: Récupère l'historique des événements d'un athlète
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'athlète
 */
router.get('/:id/events', getAthleteEvents);

export default router;