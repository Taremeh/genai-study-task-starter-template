import { Router } from 'express';
import dbPromise from './db/db';
import { setup } from "./db/setup"

const routes = Router();

routes.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

routes.get('/2', (req, res) => {
    return res.json({ message: 'Hello World 2' });
});

routes.get('/setup', async (req, res) => {
  setup().catch(err => {
    console.error('Error setting up the database:', err);
  });
});

routes.get('/users', async (req, res) => {
  // const db = await dbPromise;
  // const posts = await db.all('SELECT * FROM posts');
  const db = await dbPromise;
  const users = await db.all(`SELECT * FROM users`);
  console.log('Query results:', users);
  res.send(users);
});

routes.get('/posts', async (req, res) => {
  const db = await dbPromise;
  const posts = await db.all('SELECT * FROM posts');
  res.send(posts);
});

routes.post('/posts', async (req, res) => {
  const db = await dbPromise;
  console.log(req.body)
  const { title } = req.body;
  await db.run('INSERT INTO posts (title) VALUES (?)', title);
  res.send({ message: 'Post added successfully' });
});

export default routes;