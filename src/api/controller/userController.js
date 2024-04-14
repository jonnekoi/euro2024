import {addUser} from '../models/user-models.js';
import bcrypt from 'bcrypt';

const postUser = async (req, res) => {
  //console.log('post user', req.body);
  req.body.password = bcrypt.hashSync(req.body.password, 10);
  const result = await addUser(req.body);
  if (!result) {
    const error = new Error("Invalid or missing fields");
    error.status = 400;
  } else {
    res.status(201).json({message: "register OK"});
    console.log("Register OK");
  }
};


export {postUser};
