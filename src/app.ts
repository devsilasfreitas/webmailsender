import express from 'express';
import { mailRouter } from './routers/mail-router';
import cors from "cors";

const app = express();

app.use(cors({
    origin: "*"
}))

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use("/", mailRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});