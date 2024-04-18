import promisePool from '../../utils/database.js';

const createMatchesForUser = async (username) => {
  try {
    if (typeof username !== 'string') {
      throw new Error('Username must be a string');
    }
    const userTableName = 'user_' + username + '_matches';
    await promisePool.query('CREATE TABLE ?? AS SELECT * FROM matches', [userTableName]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export {createMatchesForUser};
