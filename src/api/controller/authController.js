import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {getUserByUsername} from '../models/user-models.js';
import 'dotenv/config';

const postLogin = async (req, res) => {
  // Validate input
  if (!req.body || !req.body.username || !req.body.password) {
    return res.status(400).send({ message: 'Syötä käyttäjänimi ja salasana' });
  }

  try {
    const user = await getUserByUsername(req.body.username);
    if (!user) {
      return res.status(401).send({ message: 'Käyttäjätiliä ei löytynyt' });
    }

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).send({ message: 'Virheellinen salasana' });
    }

    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
    res.json({ user: userWithNoPassword, token });
  } catch (error) {
    console.error('Error in postLogin:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

export {postLogin};
