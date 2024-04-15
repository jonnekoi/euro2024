import {getMatches, fetchPoints, setScore} from '../models/match-model.js';

const postMatches = async (req, res) => {
  const username = req.params.username;
  const result = await getMatches(username);
  if(result){
    res.send(result);
  }
}

const getPoints = async (req, res) => {
  const result = await fetchPoints();
  if(result){
    res.send(result);
  }
}

const postScore = async (req, res) => {
  const matchId = req.body.matchId;
  const guess = req.body.guess;
  const username = req.body.username;
  const result = await setScore(matchId, guess, username);
  console.log("post score", result);
  if(result){
    res.sendStatus(201);
  }
}

export {postMatches, getPoints, postScore};
