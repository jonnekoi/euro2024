import {
  addWinnerAdmin,
  getWinnerAdmin,
} from '../models/winner-model.js';
import {updateUserPoints} from '../models/match-model.js';
import {getAllUsers} from '../models/user-models.js';

const postWinner = async (req, res) => {
  try {
    const winner = req.body.winner;
    const users = await getAllUsers();
    console.log(winner);
    await addWinnerAdmin(winner);
    await updateUserPoints(users);
    res.status(201).json({ message: 'Winner added admin' });
  } catch (error){
    console.error('Error adding winner:', error);
    res.status(500).json({ message: 'Failed to add winner admin' });
  }
}

const getWin = async (req, res) => {
  try {
    const winner = await getWinnerAdmin();
    res.status(200).json(winner);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to get winner' });
  }
}

export {postWinner, getWin};
