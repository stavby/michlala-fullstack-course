import bodyParser from 'body-parser';
import express from 'express';
import { startDB } from './services/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || '8080';
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

startDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`);
});
