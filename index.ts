import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import httpStatus from 'http-status';
import { startDB } from './services/db';
import { commentsRouter } from './routes/comments';

dotenv.config();

const PORT = process.env.PORT || '8080';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/comments', commentsRouter);

startDB();

app.get('/isAlive', (_request: Request, response: Response) => {
    response.status(httpStatus.OK).send('Server is alive!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
