import {addUser} from '../models/user-models.js';
import bcrypt from 'bcrypt';
import {createMatchesForUser} from '../models/tableModel.js';

const postUser = async (req, res) => {
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).send({ message: 'Invalid input' });
  }

  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const result = await addUser(req.body);
    if (result.error) {
      res.status(409).send({ message: result.message });
    } else {
      await createMatchesForUser(req.body.username);
      res.status(201).json({message: "register OK"});
      console.log("Register OK");
    }
  } catch (error) {
    console.error('Error in postUser:', error);
    if (error.message === 'Invalid input') {
      res.status(400).send({message: error.message});
    } else {
      res.status(500).send({message: 'Internal server error'});
    }
  }
};



export {postUser};
