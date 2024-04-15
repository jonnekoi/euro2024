import express from 'express';
import {postMatches, getPoints} from '../controller/matchController.js';

const matchRouter = express.Router();

matchRouter.route('/matches/').get(postMatches);
matchRouter.route('/points').get(getPoints);

export {matchRouter};
