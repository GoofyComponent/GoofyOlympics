import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult, matchedData } from 'express-validator';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

