import express from "express";
import {
  AuthenticatedRequest,
  isAuthenticated,
  loadUser,
} from "../middleware/auth";

const router = express.Router();

/**
 * @swagger
 * /isvalid:
 *   get:
 *     summary: Vérifie si l'utilisateur est authentifié
 *     tags: [Utilisateur]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur authentifié
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur authentifié
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                    region:
 *                      type: string
 *       401:
 *         description: Non autorisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Non autorisé
 */
router.get(
  "/isvalid",
  isAuthenticated,
  loadUser,
  (req: AuthenticatedRequest, res) => {
    return res
      .status(200)
      .json({ message: "Utilisateur authentifié", user: req.user });
  }
);

export default router;
