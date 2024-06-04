import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

routes.get('/2', (req, res) => {
    return res.json({ message: 'Hello World 3' });
  });

export default routes;