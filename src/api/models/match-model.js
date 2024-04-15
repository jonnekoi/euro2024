import promisePool from '../../utils/database.js';

const getMatches = async (username) => {
  const userTableName = 'user_' + username + '_matches';
  const [rows] = await promisePool.query(`SELECT id, homeTeam, awayTeam, homeScore, awayScore, guess  FROM ${userTableName}`);
  return rows;
};

const fetchPoints = async () => {
  const [rows] = await promisePool.query('SELECT username, points FROM users ORDER BY points DESC LIMIT 5');
  return rows;
}

const setScore = async (matchId, guess, username) => {
  const userTableName = 'user_' + username + '_matches';
  const post = await promisePool.query(`UPDATE ${userTableName} SET guess = '${guess}' WHERE id = ${matchId}`);
}

const addMatchToDatabase = async (match) => {
  const {homeTeam, awayTeam, homeScore, awayScore} = match;
  const sql =`INSERT INTO matches (homeTeam, awayTeam, homeScore, awayScore) VALUES (?, ?, ?, ?)`;
  const params = [homeTeam, awayTeam, homeScore, awayScore];
  await promisePool.execute(sql, params);
};

export {getMatches, fetchPoints, setScore, addMatchToDatabase};
