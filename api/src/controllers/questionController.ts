import {Request, Response} from 'express';
import {PrismaClient} from '@prisma/client';
import {matchedData, validationResult} from 'express-validator';
import {AuthenticatedRequest} from '../middleware/auth';

const prisma = new PrismaClient();

export const createQuestion = async (req: AuthenticatedRequest, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({errors: result.array()});
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
        return res.status(500).json({message: "Erreur serveur"});
    }
};

export const    getQuestions = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const data = matchedData(req);
        const page = parseInt(data.page as string) || 1;
        const limit = parseInt(data.limit as string) || 10;
        const offset = (page - 1) * limit;

        try {
            const where: any = {};
            
            if (data.title) where.title = { contains: data.title };
            if (data.content) where.content = { contains: data.content };
            if (data.createdAt) where.createdAt = data.createdAt;
            if (data.updatedAt) where.updatedAt = data.updatedAt;

            if (data.hasCorrectAnswer !== undefined) {
                where.answers = {
                    some: {
                        isCorrect: data.hasCorrectAnswer === 'true'
                    }
                };
            }

            if (data.minAnswers) {
                where.answers = {
                    ...where.answers,
                    _count: {
                        gte: parseInt(data.minAnswers as string)
                    }
                };
            }

            if (data.hasUserResponses !== undefined) {
                where.responses = {
                    some: data.hasUserResponses === 'true' ? {} : undefined,
                    none: data.hasUserResponses === 'false' ? {} : undefined
                };
            }

            const [questions, total] = await Promise.all([
                prisma.question.findMany({
                    skip: offset,
                    take: limit,
                    where,
                    orderBy: {
                        createdAt: 'desc'
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
                prisma.question.count({ where })
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
            return res.status(500).json({message: "Erreur serveur"});
        }
    }
    return res.status(400).json({errors: result.array()});
};

export const getQuestionById = async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        const id = parseInt(req.params.id as string);
        try {
            const question = await prisma.question.findUnique({
                where: {id},
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
            });
            if (question) {
                return res.json(question);
            }
            return res.status(404).json({message: "Question not found"});
        } catch (error) {
            console.error("Error executing query:", error);
            return res.status(500).json({message: "Erreur serveur"});
        }
    }
    return res.status(400).json({errors: result.array()});
};
