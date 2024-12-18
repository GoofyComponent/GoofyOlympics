import {Router} from 'express';
import {query} from 'express-validator';
import {getAthleteById, getAthletes} from '../controllers/athleteController';

const router = Router();

/**
 * @swagger
 * /api/athletes:
 *   get:
 *     summary: Récupère une liste d'athlètes
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
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
 *           minimum: 1
 *           maximum: 50
 *         description: Le nombre d'athlètes à récupérer par page
 *       - in: query
 *         name: id
 *         schema:
 *          type: string
 *         description: L'identifiant de l'athlète
 *       - in: query
 *         name: name
 *         schema:
 *          type: string
 *         description: Filtrer par nom
 *       - in: query
 *         name: sex
 *         schema:
 *          type: string
 *         description: Filtrer par sexe
 *       - in: query
 *         name: age
 *         schema:
 *          type: string
 *         description: Filtrer par âge
 *       - in: query
 *         name: team
 *         schema:
 *          type: string
 *         description: Filtrer par équipe
 *       - in: query
 *         name: noc
 *         schema:
 *          type: string
 *         description: Filtrer par NOC (National Olympic Committee)
 *       - in: query
 *         name: games
 *         schema:
 *          type: string
 *         description: Filtrer par jeux olympiques
 *       - in: query
 *         name: year
 *         schema:
 *          type: string
 *         description: Filtrer par année des jeux olympiques
 *       - in: query
 *         name: season
 *         schema:
 *          type: enum
 *          enum: [Summer, Winter]
 *         description: Filtrer par saison des jeux olympiques (été ou hiver)
 *       - in: query
 *         name: city
 *         schema:
 *          type: string
 *         description: Filtrer par ville hôte des jeux olympiques
 *       - in: query
 *         name: sport
 *         schema:
 *          type: string
 *         description: Filtrer par sport
 *       - in: query
 *         name: event
 *         schema:
 *          type: string
 *         description: Filtrer par événement
 *       - in: query
 *         name: medal
 *         schema:
 *           type: enum
 *           enum: [Gold, Silver, Bronze]
 *         description: Filtrer par médaille
 *       - in: query
 *         name: height
 *         schema:
 *           type: integer
 *         description: Filtrer par taille
 *       - in: query
 *         name: weight
 *         schema:
 *           type: integer
 *         description: Filtrer par poids
 *       - in: query
 *         name: optionSort
 *         schema:
 *           type: enum
 *           enum: [less, more, equal]
 *           default: equal
 *         description: L'option de tri pour la taille et le poids
 *     responses:
 *       200:
 *         description: Une liste d'athlètes
 *       500:
 *         description: Erreur interne du serveur
 */
router.get('/',
    query("page").default(1).isInt({min: 1}).escape(),
    query("limit").default(10).isInt({max: 50}).escape(),
    query([
        "id",
        "name",
        "sex",
        "age",
        "team",
        "noc",
        "games",
        "year",
        "season",
        "city",
        "sport",
        "event",
        "medal"
    ]).optional().escape(),
    query("height").optional().isInt().escape(),
    query("weight").optional().isInt().escape(),
    query("optionSort").optional().isIn(["less", "more", "equal"]).escape(),
    getAthletes
);

router.get('/:id', getAthleteById);

export default router;
