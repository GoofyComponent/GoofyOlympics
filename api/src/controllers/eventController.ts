import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const { page = '1', limit = '200', sport, event, games, year, season, city } = req.query;
        const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

        const where: any = {};
        if (sport) where.sport = sport;
        if (event) where.event = event;
        if (games) where.games = games;
        if (year) where.year = parseInt(year as string);
        if (season) where.season = season;
        if (city) where.city = city;

        const events = await prisma.athlete_events.findMany({
            where,
            select: {
                id: true,
                sport: true,
                event: true,
                games: true,
                year: true,
                season: true,
                city: true
            },
            distinct: ['sport', 'event', 'games', 'year'],
            skip,
            take: parseInt(limit as string)
        });

        const total = await prisma.athlete_events.count({ where });

        return res.json({
            events,
            total,
            page: parseInt(page as string),
            limit: parseInt(limit as string)
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await prisma.athlete_events.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                sport: true,
                event: true,
                games: true,
                year: true,
                season: true,
                city: true
            }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getEventResults = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await prisma.athlete_events.findUnique({
            where: { id: parseInt(id) }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const results = await prisma.athlete_events.findMany({
            where: {
                sport: event.sport,
                event: event.event,
                games: event.games,
                year: event.year
            },
            select: {
                id: true,
                name: true,
                team: true,
                noc: true,
                medal: true
            },
            orderBy: {
                medal: 'asc'
            }
        });

        return res.json(results);
    } catch (error) {
        console.error('Error fetching event results:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
