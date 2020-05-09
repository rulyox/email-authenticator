import express from 'express';
import authFunction from './auth-function';

const router = express.Router();

// Start authentication and send email.
router.post('/start', authFunction.postStart);

// User should click this link to authenticate.
router.get('/:code', authFunction.get);

export default router;
