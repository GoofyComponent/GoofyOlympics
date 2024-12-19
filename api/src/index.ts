import bcrypt from "bcrypt";
import express, { Express, json, Request, Response } from "express";
import { matchedData, query, validationResult } from "express-validator";
import helmet from "helmet";
import session from "express-session";
import cors from "cors";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

import { createServer } from "node:http";

import questionRoutes from "./routes/questions";
import authRoutes from "./routes/auth";
import athletesRoutes from "./routes/athletes";
import analysisRoutes from "./routes/analytics";
import eventsRoutes from "./routes/events";

const prisma = new PrismaClient();
const LIMIT = 10;

const defaultMail = "test@test.test";
const defaultPassword = "testpassword";

try {
  const user = await prisma.users.findUnique({
    where: {
      mail: defaultMail,
    },
  });

  if (user === null) {
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await prisma.users.create({
      data: {
        mail: defaultMail,
        password: hashedPassword,
      },
    });
  }
} catch (error) {
  console.error("Error executing query", error.stack);
}

const app: Express = express();
const server = createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://goofyolympics.stroyco.eu",
  "https://api-olympics.stroyco.eu",
];
app.use(json());
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const originIsAllowed = allowedOrigins.some((allowedOrigin) => {
        return new URL(allowedOrigin).origin === new URL(origin).origin;
      });
      if (!originIsAllowed) {
        var msg = `The CORS policy for this site does not allow access from the specified Origin (${
          origin || "unknown"
        }).`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Origin"],
  })
);
app.use(helmet());
app.disable("x-powered-by");

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
app.use(
  session({
    secret: process.env.SESSION_SECRET || "MySecretIsLame",
    name: "sessionId",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      expires: expiryDate,
    },
  })
);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil de l'API
 *     responses:
 *       200:
 *         description: Message de bienvenue
 */
app.get("/", (req: Request, res: Response) => {
  res.send(
    "Welcome to the unofficial Olympics API, please use the /api endpoint to access the data. For more information, visit: https://api-olympics.stroyco.eu/api-docs/"
  );
});

/**
 * @swagger
 * /api/regions:
 *   get:
 *     summary: Récupère une liste de regions du NOC (National Olympic Committee)
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
 *         description: Le nombre de régions à récupérer par page
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         description: L'identifiant de la région
 *       - in: query
 *         name: noc
 *         schema:
 *           type: string
 *         description: Le NOC (National Olympic Committee) de la région
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *         description: Le nom du Pays
 *       - in: query
 *         name: notes
 *         schema:
 *           type: string
 *         description: Notes sur la région
 *     responses:
 *       200:
 *         description: Une liste de régions
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
  "/api/regions",
  query("page").default(1).isInt({ min: 1 }).escape(),
  query("limit").default(LIMIT).isInt({ max: 50 }).escape(),
  query(["id", "noc", "region", "notes"]).optional().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);
      const page = parseInt(data.page as string);
      const limit = parseInt(data.limit as string);
      const offset = (page - 1) * limit;

      try {
        // Build where clause
        const where: any = {};
        for (const key in data) {
          if (key !== "page" && key !== "limit" && data[key]) {
            if (key === "id") {
              where[key] = parseInt(data[key]);
            } else {
              where[key] = data[key];
            }
          }
        }

        const [regions, total] = await Promise.all([
          prisma.noc_regions.findMany({
            where,
            skip: offset,
            take: limit,
          }),
          prisma.noc_regions.count({ where }),
        ]);

        return res.json({
          regions,
          total,
          currentPage: page,
          currentLimit: limit,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error("Error executing query", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    return res.status(400).json({ errors: result.array() });
  }
);

/**
 * @swagger
 * /api/medals:
 *   get:
 *     summary: Récupère une liste de médailles
 *     parameters:
 *       - in: query
 *         name: noc
 *         schema:
 *           type: string
 *         description: Filtrer par NOC (National Olympic Committee)
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *         description: Filtrer par année
 *     responses:
 *       200:
 *         description: Une liste de médailles
 *       500:
 *         description: Erreur interne du serveur
 */
app.get(
  "/api/medals",
  query(["noc", "year"]).optional().escape(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const data = matchedData(req);

      try {
        const medals = await prisma.athlete_events.groupBy({
          by: ["medal", "noc"],
          where: {
            ...(data.noc ? { noc: data.noc.toUpperCase() } : {}),
            ...(data.year ? { year: parseInt(data.year) } : {}),
            medal: {
              in: ["Gold", "Silver", "Bronze"],
            },
          },
          _count: {
            medal: true,
          },
        });

        // Organiser les résultats par pays avec les types de médailles
        const pays: Record<
          string,
          { Gold: number; Silver: number; Bronze: number; total: number }
        > = {};

        medals.forEach((element) => {
          if (
            element.noc &&
            typeof element.noc === "string" &&
            element.noc.length > 0
          ) {
            if (!pays[element.noc]) {
              pays[element.noc] = { Gold: 0, Silver: 0, Bronze: 0, total: 0 };
            }

            if (element.medal) {
              pays[element.noc][element.medal] = element._count.medal;
              pays[element.noc].total += element._count.medal;
            }
          }
        });

        return res.json({
          medals: {
            medals: pays,
          },
        });
      } catch (error) {
        console.error("Error executing query", error);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    }
    return res.status(400).json({ message: "Invalid parameters" });
  }
);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on(
    "submit_answer",
    async (data: { questionId: number; answerId: number; userId: number }) => {
      try {
        // Vérifier si l'utilisateur existe
        const user = await prisma.users.findUnique({
          where: { id: data.userId },
        });

        if (!user) {
          socket.emit("answer_error", { message: "Utilisateur non trouvé" });
          return;
        }

        // Vérifier si la question existe
        const question = await prisma.question.findUnique({
          where: { id: data.questionId },
        });

        if (!question) {
          socket.emit("answer_error", { message: "Question non trouvée" });
          return;
        }

        // Vérifier si la réponse existe et appartient à la question
        const answer = await prisma.answer.findFirst({
          where: {
            id: data.answerId,
            questionId: data.questionId,
          },
        });

        if (!answer) {
          socket.emit("answer_error", {
            message: "Réponse non trouvée ou invalide",
          });
          return;
        }

        try {
          // Vérifier si une réponse existe déjà
          const existingResponse = await prisma.userResponse.findUnique({
            where: {
              userId_questionId: {
                userId: data.userId,
                questionId: data.questionId,
              },
            },
          });

          let response;
          if (existingResponse) {
            // Mettre à jour la réponse existante
            response = await prisma.userResponse.update({
              where: {
                userId_questionId: {
                  userId: data.userId,
                  questionId: data.questionId,
                },
              },
              data: {
                answerId: data.answerId,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    mail: true,
                  },
                },
                answer: {
                  select: {
                    isCorrect: true,
                    content: true,
                  },
                },
              },
            });
          } else {
            response = await prisma.userResponse.create({
              data: {
                userId: data.userId,
                questionId: data.questionId,
                answerId: data.answerId,
              },
              include: {
                user: {
                  select: {
                    id: true,
                    mail: true,
                  },
                },
                answer: {
                  select: {
                    isCorrect: true,
                    content: true,
                  },
                },
              },
            });
          }

          // Émettre la réponse
          io.emit("new_response", {
            userId: response.user.id,
            mail: response.user.mail,
            isCorrect: response.answer.isCorrect,
            content: response.answer.content,
          });
        } catch (error) {
          console.error(
            "Erreur lors de l'enregistrement de la réponse:",
            error
          );
          socket.emit("answer_error", {
            message: "Erreur lors de l'enregistrement de la réponse",
          });
        }
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de la réponse:", error);
        socket.emit("answer_error", {
          message: "Erreur lors de l'enregistrement de la réponse",
          details: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    }
  );

  socket.on("disconnect", () => {
    console.log("Un utilisateur s'est déconnecté");
  });
});

// Routes
app.use("/api/questions", questionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/athletes", athletesRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/events", eventsRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on("exit", async () => {
  process.exit();
});
process.on("SIGINT", async () => {
  process.exit();
});
process.on("SIGTERM", async () => {
  process.exit();
});
