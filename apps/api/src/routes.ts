import express from 'express';
import { getProducts } from './controllers/products.controllers';
import { getCategories } from './controllers/categories.controllers';
import { registerUser, loginUser } from './controllers/auth.controllers';
import { protect } from './middleware/auth.middleware';
import { findUserById } from './models/User';

const router = express.Router();

router.get('/', (req, res) => {
  return res.json({ message: 'Hello World' });
});

router.get('/products', getProducts);
router.get('/categories', getCategories);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, async (req, res) => {
  console.log("MErequest1", req.body.user);
  console.log("MErequest2", req.body.user.id);
  // Assuming req.user contains the authenticated user's ID
  const user = await findUserById(req.body.user); // Implement findUserById to fetch user by ID
  if (user) {
    res.json({ user });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

export default router;