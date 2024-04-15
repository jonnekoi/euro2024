import {
  getMatches,
  fetchPoints,
  setScore,
  addMatchToDatabase,
  addMatchToUserTables,
} from '../models/match-model.js';
import {createMatchesForUser} from '../models/tableModel.js';
import {getAllUsers} from '../models/user-models.js';

const postMatches = async (req, res) => {
  const username = req.params.username;
  const result = await getMatches(username);
  if (result) {
    res.send(result);
  }
};

const getPoints = async (req, res) => {
  const result = await fetchPoints();
  if (result) {
    res.send(result);
  }
};

const postScore = async (req, res) => {
  const matchId = req.body.matchId;
  const guess = req.body.guess;
  const username = req.body.username;
  const result = await setScore(matchId, guess, username);
  console.log('post score', result);
  if (result) {
    res.sendStatus(201);
  }
};

const addMatch = async (req, res) => {
  const match = {
    homeTeam: req.body.homeTeam,
    awayTeam: req.body.awayTeam,
    homeScore: req.body.homeScore,
    awayScore: req.body.awayScore
  }
  try {
    await addMatchToDatabase(req.body);
    const users = await getAllUsers();
    console.log(users);
    await addMatchToUserTables(req.body, users);
    res.status(201).send({ message: "Match added" });
  } catch (error) {
    console.error("Error adding match:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
};

export {postMatches, getPoints, postScore, addMatch};
