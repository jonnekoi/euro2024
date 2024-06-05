import express from 'express';
import {
  postMatches,
  getPoints,
  postScore,
  addWinner,
  addMatch, checkWinner, addResult,
} from '../controller/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/matches/:username').get(postMatches);
matchRouter.route('/matches').post(addMatch).put(addResult);
matchRouter.route('/points').get(getPoints).post(postScore);
matchRouter.route('/winner').post(addWinner);
matchRouter.route('/guess/:username').get(checkWinner);
export default matchRouter;
