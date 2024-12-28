import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import httpStatus from 'http-status';
import { postsRouter } from './routes/posts';
import { commentsRouter } from './routes/comments';
import { startDB } from './services/db';
import { swagger } from './swagger';

dotenv.config();

const PORT = process.env.PORT || '8080';
export const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startDB();

app.get('/isAlive', (_request: Request, response: Response) => {
	response.status(httpStatus.OK).send('Server is alive!');
});
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);

app.use('/swagger', swagger.serve, swagger.setup);

if (process.env.NODE_ENV !== 'test') {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}!`);
	});
}
