import express from 'express';
import likesRouter from './routes/likes';
import postsRouter from './routes/posts';
import usersRouter from './routes/users';

require("dotenv").config();

const PORT: number = Number(process.env.PORT);

const app = express();

app.use(express.json());

app.use('/', likesRouter);
app.use('/', postsRouter);
app.use('/', usersRouter);

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));