import { Router } from 'express';
import PostController from '../controller/PostController';
import authenticate from '../middleware/authentication';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           nullable: true
 *           example: "Meu primeiro post"
 *         content:
 *           type: string
 *           example: "Este é o conteúdo do post."
 *         userId:
 *           type: integer
 *           example: 42
 *         likes:
 *           type: integer
 *           example: 10
 *         parentId:
 *           type: integer
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-15T12:34:56Z"
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Retorna todos os posts de um usuário
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: username
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome de usuário para filtrar posts
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
router.get("/posts", async (req, res) => {
    const user = req.query.username;

    const posts = await PostController.getPostsFromUser(user);

    res.send(posts);
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Retorna um post específico
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 */
router.get("/posts/:id", async (req, res) => {
    const id = req.params.id;

    const post = await PostController.getPost(id);

    if (post === undefined) {
        res.sendStatus(404);
        return;
    }

    res.send(post);
});

/**
 * @swagger
 * /posts/{id}/comments:
 *   get:
 *     summary: Retorna os comentários de um post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de comentários (posts filhos)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post não encontrado
 */
router.get("/posts/:id/comments", async (req, res) => {
    const id = req.params.id;

    const comments = await PostController.getPostComments(id);

    if (comments === undefined) {
        res.sendStatus(404);
        return;
    }

    res.send(comments);
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria um novo post ou comentário
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - title: Post
 *                 description: Criação de post principal (com título, sem parentId)
 *                 type: object
 *                 required:
 *                   - title
 *                   - content
 *                 properties:
 *                   title:
 *                     type: string
 *                     example: "Título do post"
 *                   content:
 *                     type: string
 *                     example: "Conteúdo do post principal"
 *               - title: Comentário
 *                 description: Criação de comentário (sem título, com parentId)
 *                 type: object
 *                 required:
 *                   - content
 *                   - parentId
 *                 properties:
 *                   content:
 *                     type: string
 *                     example: "Conteúdo do comentário"
 *                   parentId:
 *                     type: integer
 *                     example: 123
 *     responses:
 *       201:
 *         description: Post ou comentário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Erro na criação (validação ou dados faltando)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "O post ter um conteúdo"
 *       401:
 *         description: Não autorizado
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
router.post("/posts", authenticate, async (req, res) => {
    const newPost = req.body;
    const userId = req.body.user.id;

    const { createdPost, error } = await PostController.createNewPost(newPost, userId);

    if (error !== undefined) {
        res.status(400).send({ "error": error });
        return;
    }

    res.status(201).send(createdPost);
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Deleta um post do usuário autenticado
 *     tags: [Posts]
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
 *         description: Post deletado com sucesso
 *       401:
 *         description: Não autorizado (token inválido ou ausente)
 *       404:
 *         description: Post não encontrado
 */
router.delete("/posts/:id", authenticate, async (req, res) => {
    const id = req.params.id;
    const userId = req.body.user.id;
    
    const isDeleted = await PostController.deletePost(id, userId);

    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(200);
});

export default router;