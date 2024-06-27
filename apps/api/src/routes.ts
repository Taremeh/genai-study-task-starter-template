import express from 'express';
import { getProducts } from './controllers/products.controllers';
import { getCategories } from './controllers/categories.controllers';

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

router.get('/products', getProducts);
router.get('/categories', getCategories);

export default router;