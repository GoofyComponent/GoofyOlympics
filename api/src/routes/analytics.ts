import express from 'express';
import {query} from 'express-validator';
import {
    getCountryDominanceOverTime,
    getGenderDistributionBySport,
    getMedalDistributionByAge,
    getMostVersatileAthletes,
    getPhysicalAttributesBySport,
    getSportEvolutionByYear,
    getTopMedalCountriesBySport
} from '../controllers/analyticsController';

const router = express.Router();

/**
 * @swagger
 * /api/analytics/top-medal-countries:
 *   get:
 *     summary: Obtient les pays avec le plus de médailles par sport
 *     parameters:
 *       - name: sport
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/top-medal-countries',
    query('sport').isString(),
    query('limit').optional().isInt({min: 1}),
    getTopMedalCountriesBySport
);

/**
 * @swagger
 * /api/analytics/medal-by-age:
 *   get:
 *     summary: Distribution des médailles par âge
 */
router.get('/medal-by-age', getMedalDistributionByAge);

/**
 * @swagger
 * /api/analytics/sport-evolution:
 *   get:
 *     summary: Évolution d'un sport au fil des années
 *     parameters:
 *       - name: sport
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/sport-evolution',
    query('sport').isString(),
    getSportEvolutionByYear
);

/**
 * @swagger
 * /api/analytics/gender-distribution:
 *   get:
 *     summary: Distribution des genres par sport
 */
router.get('/gender-distribution', getGenderDistributionBySport);

/**
 * @swagger
 * /api/analytics/physical-attributes:
 *   get:
 *     summary: Attributs physiques moyens par sport
 */
router.get('/physical-attributes', getPhysicalAttributesBySport);

/**
 * @swagger
 * /api/analytics/versatile-athletes:
 *   get:
 *     summary: Athlètes ayant participé à le plus de sports différents
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 */
router.get('/versatile-athletes',
    query('limit').optional().isInt({min: 1}),
    getMostVersatileAthletes
);

/**
 * @swagger
 * /api/analytics/country-dominance:
 *   get:
 *     summary: Évolution des performances d'un pays au fil du temps
 *     parameters:
 *       - name: noc
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/country-dominance',
    query('noc').isString(),
    getCountryDominanceOverTime
);

export default router;
