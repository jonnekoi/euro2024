import promisePool from '../../utils/database.js';

const getMatches = async () => {
  const [rows] = await promisePool.query('SELECT homeTeam, awayTeam FROM matches');
  return rows;
};

const fetchPoints = async () => {
  const [rows] = await promisePool.query('SELECT username, points FROM users ORDER BY points DESC LIMIT 5');
  return rows;
}

export {getMatches, fetchPoints};
