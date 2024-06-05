import express from 'express';
import {
  postWinner,
  getWin,
} from '../controller/winnerController.js';

const winnerRouter = express.Router();

winnerRouter.route('/winner/add').put(postWinner).get(getWin);
export default winnerRouter;
