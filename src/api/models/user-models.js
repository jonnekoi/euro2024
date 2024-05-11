import promisePool from '../../utils/database.js';

const addUser = async (user) => {
  try {
    const {name, username, email, role, password} = user;

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return { error: true, message: 'Username already exists' };
    }

    const sql = `INSERT INTO users (name, username, email, role, password) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, username, email, role, password];
    const [result] = await promisePool.execute(sql, params);
    return {user_id: result.insertId};
  } catch (error) {
    console.error('Failed to add user:', error);
    return { error: true, message: 'Failed to add user' };
  }
};

const getUserByUsername = async (username) => {
  const sql = `SELECT *
              FROM users 
              WHERE username = ?`;
  try {
    const [rows] = await promisePool.execute(sql, [username]);
    if (rows.length === 0){
      return false;
  } else {
      return rows[0];
    }
  } catch (error) {
    console.error('Failed to get username', error)
    return { error: true, message: 'Failed to add user' };
  }
};

const getAllUsers = async () => {
  try {
    const sql = `SELECT username
                FROM users`;
    const [rows] = await promisePool.execute(sql);
    return rows;
  } catch (error) {
    console.error('Failed to get all users:', error);
    return { error: true, message: 'Failed to get all users' };
  }
};

const isUsernameAvailable = async (username) => {
  const [response] = await promisePool.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
  );
  return response.length === 0;
};

export {addUser, getUserByUsername, getAllUsers, isUsernameAvailable};

