import { Request, Response } from 'express';
import prisma from '../lib/prisma';
export const getAthletes = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '10', name, sex, team, noc } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (name) where.name = { contains: name as string, mode: 'insensitive' };
        if (sex) where.sex = sex;
        if (team) where.team = team;
        if (noc) where.noc = noc;

        const athletes = await prisma.athlete_events.findMany({
            where,
            select: {
                id: true,
                name: true,
                sex: true,
                age: true,
                height: true,
                weight: true,
                team: true,
                noc: true
            },
            distinct: ['name', 'noc'] as const,
            skip,
            take: parseInt(limit as string)
        });

        return res.json({
            athletes,
            page: parseInt(page as string),
            limit: parseInt(limit as string)
        });
    } catch (error) {
        console.error('Error fetching athletes:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAthleteById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const athlete = await prisma.athlete_events.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                sex: true,
                age: true,
                height: true,
                weight: true,
                team: true,
                noc: true
            }
        });

        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }

        return res.json(athlete);
    } catch (error) {
        console.error('Error fetching athlete:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAthleteEvents = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const athlete = await prisma.athlete_events.findUnique({
            where: { id: parseInt(id) }
        });

        if (!athlete) {
            return res.status(404).json({ message: 'Athlete not found' });
        }

        const events = await prisma.athlete_events.findMany({
            where: {
                name: athlete.name,
                noc: athlete.noc
            },
            select: {
                id: true,
                sport: true,
                event: true,
                games: true,
                year: true,
                medal: true
            },
            orderBy: {
                year: 'desc'
            }
        });

        return res.json(events);
    } catch (error) {
        console.error('Error fetching athlete events:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
