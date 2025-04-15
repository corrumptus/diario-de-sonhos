import { Router } from "express";
import LikeController from "../controller/LikeController";
import authenticate from "../middleware/authentication";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         userId:
 *           type: integer
 *           example: 42
 *         postId:
 *           type: integer
 *           example: 100
 */

/**
 * @swagger
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Cria um like em um post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 100
 *               userId:
 *                 type: integer
 *                 example: 444
 *     responses:
 *       201:
 *         description: Like criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       400:
 *         description: Erro ao criar like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O usuário só pode criar likes próprios"
 *       401:
 *         description: Não autorizado
 */
router.post("/likes", authenticate, async (req, res) => {
    const like = req.body;
    const userId = req.body.user.id;

    const { createdLike, error } = await LikeController.createNewLike(like, userId);

    if (createdLike === undefined) {
        res.status(400).send({ "error": error });
        return;
    }

    res.status(201).send(createdLike);
});

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Remove um like do usuário autenticado
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like removido com sucesso
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Like não encontrado
 */
router.delete("/likes/:id", authenticate, async (req, res) => {
    const id = req.params.id;
    const userId = req.body.user.id;

    const isDeleted = await LikeController.deleteLike(id, userId);

    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(200);
});

export default router;