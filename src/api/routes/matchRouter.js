import express from 'express';
import {
  postMatches,
  getPoints,
  postScore,
  addMatch
} from '../controller/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/matches/:username').get(postMatches);
matchRouter.route('/matches').post(addMatch);
matchRouter.route('/points').get(getPoints).post(postScore);

export default matchRouter;
