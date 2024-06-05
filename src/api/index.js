import express from 'express';
import authRouter from './routes/authRouter.js';
import matchRouter from './routes/matchRouter.js';
import winnerRouter from './routes/winnerRouter.js';

const router = express.Router();


router.use('/auth', authRouter);
router.use('/get', matchRouter);
router.use('/', winnerRouter);
export default router;
