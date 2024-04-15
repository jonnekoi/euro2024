import {addUser} from '../models/user-models.js';
import bcrypt from 'bcrypt';
import {createMatchesForUser} from '../models/tableModel.js';

const postUser = async (req, res) => {
  //console.log('post user', req.body);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  try{
    const result = await addUser(req.body);
    if (result.error) {
      res.status(409).send({ message: result.message });
    } else {
      await createMatchesForUser(req.body.username);
      res.status(201).json({message: "register OK"});
      console.log("Register OK");
    }
  } catch (error){
    res.status(500).send({message: error.message})
  }
};



export {postUser};
