import {Request, Response} from 'express';
import prisma from '../lib/prisma';

export const getTopMedalCountriesBySport = async (req: Request, res: Response) => {
    const {sport, limit = 10} = req.query;
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['noc'],
            where: {
                sport: sport as string,
                medal: {not: null}
            },
            _count: {
                medal: true
            },
            orderBy: {
                _count: {
                    medal: 'desc'
                }
            },
            take: Number(limit)
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getMedalDistributionByAge = async (req: Request, res: Response) => {
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['age', 'medal'],
            where: {
                medal: {not: null},
                age: {not: null}
            },
            _count: true,
            orderBy: {
                age: 'asc'
            }
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getSportEvolutionByYear = async (req: Request, res: Response) => {
    const {sport} = req.query;
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['year', 'season'],
            where: {
                sport: sport as string
            },
            _count: {
                _all: true
            },
            orderBy: {
                year: 'asc'
            }
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getGenderDistributionBySport = async (req: Request, res: Response) => {
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['sport', 'sex'],
            _count: true,
            orderBy: [
                {sport: 'asc'},
                {sex: 'asc'}
            ]
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getPhysicalAttributesBySport = async (req: Request, res: Response) => {
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['sport'],
            where: {
                height: {not: null},
                weight: {not: null}
            },
            _avg: {
                height: true,
                weight: true
            },
            _min: {
                height: true,
                weight: true
            },
            _max: {
                height: true,
                weight: true
            }
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getMostVersatileAthletes = async (req: Request, res: Response) => {
    const {limit = 10} = req.query;
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['name', 'sex'],
            _count: {
                sport: true
            },
            having: {
                sport: {
                    _count: {
                        gt: 1
                    }
                }
            },
            orderBy: {
                _count: {
                    sport: 'desc'
                }
            },
            take: Number(limit)
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const getCountryDominanceOverTime = async (req: Request, res: Response) => {
    const {noc} = req.query;
    try {
        const results = await prisma.athlete_events.groupBy({
            by: ['year', 'noc', 'medal'],
            where: {
                noc: noc as string,
                medal: {not: null}
            },
            _count: true,
            orderBy: {
                year: 'asc'
            }
        });

        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erreur serveur"});
    }
};
