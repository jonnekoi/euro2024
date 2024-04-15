import express from 'express';
import {
  postMatches,
  getPoints,
  postScore,
} from '../controller/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/matches/:username').get(postMatches);
matchRouter.route('/points').get(getPoints).post(postScore);

export {matchRouter};
