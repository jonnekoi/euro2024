import promisePool from '../../utils/database.js';

const addUser = async (user) => {
  const {name, username, email, role, password} = user;

  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return { error: true, message: 'Username already exists' };
  }

  const sql = `INSERT INTO users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)`;
  const params = [name, username, email, role, password];
  const [result] = await promisePool.execute(sql, params);
  return {user_id: result.insertId};
};

const getUserByUsername = async (username) => {
  const sql = `SELECT *
              FROM users 
              WHERE username = ?`;
  const [rows] = await promisePool.execute(sql, [username]);
  if (rows.length === 0){
    return false;
  }
  return rows[0];
};

export {addUser, getUserByUsername};

