import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

declare module 'express-session' {
    interface SessionData {
        userId: number;
    }
}

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        mail: string;
    }
}

export function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    if (!req.session.userId) {
        return res.status(401).json({ message: "Non authentifié" });
    }
    next();
}

export async function loadUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const user = await prisma.users.findUnique({
            where: { id: req.session.userId },
            select: { id: true, mail: true }
        });
        req.user = user || undefined;
        next();
    } catch (error) {
        next(error);
    }
}
