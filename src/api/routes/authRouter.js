import express from 'express';
import {postUser} from '../controller/userController.js';
import {postLogin} from '../controller/authController.js';

const authRouter = express.Router();
authRouter.route('/register').post(postUser);
authRouter.route('/login').post(postLogin);

export default authRouter;
