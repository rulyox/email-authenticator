import express from 'express';
import * as authController from './auth-controller';

const router = express.Router();

// Start authentication and send email.
router.post('/start', authController.postStart);

// User should click this link to authenticate.
router.get('/:code', authController.get);

export default router;
