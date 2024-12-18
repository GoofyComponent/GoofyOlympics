import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult, matchedData } from 'express-validator';

const prisma = new PrismaClient();
const LIMIT = 10;

export const getAthletes = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        const page = parseInt(data.page as string) || 1;
        const offset = (page - 1) * LIMIT;
        const limit = parseInt(data.limit as string) || LIMIT;

        try {
            const where: any = {};
            
            if (data.id) where.id = data.id;
            if (data.name) where.name = { contains: data.name };
            if (data.sex) where.sex = data.sex;
            if (data.age) where.age = parseInt(data.age as string);
            if (data.team) where.team = data.team;
            if (data.noc) where.noc = data.noc.toUpperCase();
            if (data.games) where.games = data.games;
            if (data.year) where.year = parseInt(data.year as string);
            if (data.season) where.season = data.season;
            if (data.city) where.city = data.city;
            if (data.sport) where.sport = data.sport;
            if (data.event) where.event = data.event;
            if (data.medal) where.medal = data.medal;

            if (data.height || data.weight) {
                const optionSort = data.optionSort || "equal";
                if (data.height) {
                    const height = parseInt(data.height as string);
                    switch (optionSort) {
                        case "less":
                            where.height = { lt: height };
                            break;
                        case "more":
                            where.height = { gt: height };
                            break;
                        default:
                            where.height = height;
                    }
                }
                if (data.weight) {
                    const weight = parseInt(data.weight as string);
                    switch (optionSort) {
                        case "less":
                            where.weight = { lt: weight };
                            break;
                        case "more":
                            where.weight = { gt: weight };
                            break;
                        default:
                            where.weight = weight;
                    }
                }
            }

            const [athletes, total] = await Promise.all([
                prisma.athlete_events.findMany({
                    skip: offset,
                    take: limit,
                    where,
                    orderBy: {
                        name: 'asc'
                    }
                }),
                prisma.athlete_events.count({ where })
            ]);

            return res.json({
                data: athletes,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error("Error executing query:", error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
    return res.status(400).json({ errors: result.array() });
};

export const getAthleteById = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = parseInt(req.params.id as string);
        try {
            const athlete = await prisma.athlete_events.findUnique({
                where: { id }
            });
            if (athlete) {
                return res.json(athlete);
            }
            return res.status(404).json({ message: "Athlete not found" });
        } catch (error) {
            console.error("Error executing query:", error);
            return res.status(500).json({ message: "Erreur serveur" });
        }
    }
    return res.status(400).json({ errors: result.array() });
};
