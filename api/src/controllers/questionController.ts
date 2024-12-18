import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult, matchedData } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const createQuestion = async (req: AuthenticatedRequest, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    const data = matchedData(req);
    try {
        const question = await prisma.question.create({
            data: {
                title: data.title,
                content: data.content,
                answers: {
                    create: data.answers
                }
            },
            include: {
                answers: true
            }
        });
        return res.status(201).json(question);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};

export const getQuestions = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const title = (req.query.title as string) || "";
    const content = (req.query.content as string) || "";

    try {
        const [questions, total] = await Promise.all([
            prisma.question.findMany({
                skip: (page - 1) * limit,
                take: limit,
                where: {
                    title: { contains: title },
                    content: { contains: content },
                },
                include: {
                    answers: true,
                    responses: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    mail: true
                                }
                            },
                            answer: true
                        }
                    }
                }
            }),
            prisma.question.count({
                where: {
                    title: { contains: title },
                    content: { contains: content },
                }
            })
        ]);

        return res.json({
            data: questions,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Erreur serveur" });
    }
};
