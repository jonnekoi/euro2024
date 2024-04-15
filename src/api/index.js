import express from 'express';
import authRouter from './routes/authRouter.js';
import matchRouter from './routes/matchRouter.js';

const router = express.Router();


router.use('/auth', authRouter);
router.use('/get', matchRouter);
export default router;
