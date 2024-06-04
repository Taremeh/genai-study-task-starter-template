import express from 'express';
import routes from './routes';

const app = express();
const port = 3333;

app.use(routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
