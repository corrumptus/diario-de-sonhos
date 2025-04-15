import { Router } from 'express';
import UserController from '../controller/UserController';
import authenticate from '../middleware/authentication';

const router = Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: myUserName
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Erro ao criar usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Não foi possível criar o usuário"
 */
router.post("/signup", async (req, res) => {
    const user = req.body;

    const { token, error } = await UserController.createNewUser(user);

    if (error !== undefined) {
        res.status(400).send({ "error": error });
        return;
    }

    res.status(201).send({ token: token });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Erro no login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Credenciais inválidas"
 */
router.post("/login", async (req, res) => {
  const user = req.body;

  const { token, error } = await UserController.loginUser(user);

  if (error !== undefined) {
      res.status(400).send({ "error": error });
      return;
  }

  res.send({ token: token });
});

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Deleta o usuário autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "user-id-123"
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       401:
 *         description: Token de autenticação inválido ou ausente
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.delete("/users", authenticate, async (req, res) => {
    const id = req.body.user.id;

    const isDeleted = await UserController.deleteUser(id);

    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(200);
});

export default router;