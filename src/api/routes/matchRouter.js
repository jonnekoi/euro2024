import express from 'express';
import {
  postMatches,
  getPoints,
  postScore,
  addWinner,
  addMatch, addResult,
} from '../controller/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/matches/:username').get(postMatches);
matchRouter.route('/matches').post(addMatch).put(addResult);
matchRouter.route('/points').get(getPoints).post(postScore);
matchRouter.route('/winner').post(addWinner);

export default matchRouter;
