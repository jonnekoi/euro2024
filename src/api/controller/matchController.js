import {
  getMatches,
  fetchPoints,
  setScore,
  addMatchToDatabase,
  addResultToDatabase,
  addResultToUserTables, updateUserPoints, addMatchToUserTables,
} from '../models/match-model.js';
import { getAllUsers } from '../models/user-models.js';

const postMatches = async (req, res) => {
  try {
    const username = req.params.username;
    const matches = await getMatches(username);
    res.status(200).json(matches);
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};

const getPoints = async (req, res) => {
  try {
    const points = await fetchPoints();
    res.status(200).json(points);
  } catch (error) {
    console.error('Error fetching points:', error);
    res.status(500).json({ message: 'Failed to fetch points' });
  }
};

const postScore = async (req, res) => {
  try {
    const { matchId, guess, username } = req.body;
    await setScore(matchId, guess, username);
    res.sendStatus(201);
  } catch (error) {
    console.error('Error posting score:', error);
    res.status(500).json({ message: 'Failed to post score' });
  }
};

const addMatch = async (req, res) => {
  try {
    const matchData = {
      homeTeam: req.body.homeTeam,
      awayTeam: req.body.awayTeam,
      homeScore: req.body.homeScore,
      awayScore: req.body.awayScore
    };
    await addMatchToDatabase(matchData);
    const users = await getAllUsers();
    await addMatchToUserTables(matchData, users);
    res.status(201).json({ message: 'Match added' });
  } catch (error) {
    console.error('Error adding match:', error);
    res.status(500).json({ message: 'Failed to add match' });
  }
};

const addResult = async (req, res) => {
  try {
    const resultData = {
      homeTeam: req.body.homeTeam,
      awayTeam: req.body.awayTeam,
      homeScore: req.body.homeScore,
      awayScore: req.body.awayScore
    };
    await addResultToDatabase(resultData);
    const users = await getAllUsers();
    await addResultToUserTables(resultData, users);
    await updateUserPoints(users);
    res.status(201).json({ message: 'Result added' });
  } catch (error) {
    console.error('Error adding result:', error);
    res.status(500).json({ message: 'Failed to add result' });
  }
};

export { postMatches, getPoints, postScore, addMatch, addResult };
